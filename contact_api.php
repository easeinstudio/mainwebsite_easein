<?php
// contact_api.php

// ================= GLOBAL SETTINGS =================
error_reporting(E_ALL);
ini_set('display_errors', 0); // don't show PHP errors to browser
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/contact_api_error.log');

// ---------- CORS ----------
header('Access-Control-Allow-Origin: *'); // Allow all origins (simplest)
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'CORS preflight OK']);
    exit;
}

// ---------- Only POST beyond this ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Use POST.'
    ]);
    exit;
}

// ========== PHPMailer & CONFIG ==========
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';
require __DIR__ . '/phpmailer/src/Exception.php';

// SMTP config
$smtpHost = 'smtp.hostinger.com';
$smtpPort = 465;
$smtpUser = 'info@easeinstudio.com';
$smtpPass = 'Easeinstudio@2025@'; // Ensure this password is correct

// Alternative config - Try port 587 if 465 fails
$smtpHost2 = 'smtp.hostinger.com';
$smtpPort2 = 587;

$fromEmail = 'info@easeinstudio.com';
$fromName  = 'Easein Studio';

// ========= ADMIN RECEIVER (UPDATED) =========
$adminEmail = 'easeinstudiohr@gmail.com';   // HR / admin inbox
$adminName  = 'Easein Studio Team';         // display name
// ===========================================

// Brand theme (from your :root CSS)
$primaryColor   = '#00eaff'; // --accent-cyan / --accent-1
$secondaryColor = '#00b4d8'; // --accent-teal / --accent-2
$bgDark1        = '#02060a'; // --bg-dark-1
$cardBg         = 'rgba(2, 20, 28, 0.98)'; // close to --card-glass

// Logo URL (update if different)
$logoUrl = 'https://easeinstudio.com/logo.png';

// -------- Helper: sanitize --------
function clean($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

// -------- Get form data --------
$name           = isset($_POST['name']) ? clean($_POST['name']) : '';
$email          = isset($_POST['email']) ? clean($_POST['email']) : '';
$phone          = isset($_POST['phone']) ? clean($_POST['phone']) : '';
$videoType      = isset($_POST['video_type']) ? clean($_POST['video_type']) : '';
$projectDetails = isset($_POST['project_details']) ? clean($_POST['project_details']) : '';

// -------- Validate --------
$errors = [];

if ($name === '') {
    $errors[] = 'Name is required.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
}
if ($phone === '') {
    $errors[] = 'Phone is required.';
}
if ($videoType === '') {
    $errors[] = 'Type of video is required.';
}
if ($projectDetails === '') {
    $errors[] = 'Project details are required.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Validation error.',
        'errors'  => $errors
    ]);
    exit;
}

// -------- Optional: File upload --------
$fileAttached = false;
$filePath     = '';
$fileName     = '';

if (isset($_FILES['reference_upload']) && $_FILES['reference_upload']['error'] === UPLOAD_ERR_OK) {
    $tmpName  = $_FILES['reference_upload']['tmp_name'];
    $fileName = basename($_FILES['reference_upload']['name']);
    $filePath = $tmpName;
    $fileAttached = true;
}

// -------- Email contents base --------
$videoTypeLabel      = $videoType !== '' ? $videoType : 'Not specified';
$projectDetailsHtml  = nl2br($projectDetails);
$submittedAt         = date('Y-m-d H:i:s');

// Common wrapper styles for both emails
$wrapperStyle = "
    margin:0;
    padding:24px;
    background: radial-gradient(circle at top, {$secondaryColor}16 0, {$bgDark1} 55%, #000000 100%);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color:#e6f9ff;
";

$cardStyle = "
    max-width:640px;
    margin:0 auto;
    background: {$cardBg};
    border-radius:18px;
    padding:24px 24px 28px;
    box-shadow:0 20px 50px rgba(0,0,0,0.75);
    border:1px solid {$secondaryColor}33;
";

$logoRowStyle = "
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:18px;
";

$badgeStyle = "
    font-size:11px;
    letter-spacing:0.12em;
    text-transform:uppercase;
    color:{$primaryColor};
    background:{$primaryColor}1a;
    border-radius:999px;
    padding:4px 10px;
    border:1px solid {$primaryColor}40;
";

$h1Style = "
    font-size:20px;
    margin:0 0 10px;
    color:#f5fbff;
";

$metaStyle = "
    font-size:12px;
    color:#9adff0;
    margin-bottom:18px;
";

$labelStyle = "
    font-size:13px;
    color:#9adff0;
    margin:0 0 3px;
";

$valueStyle = "
    font-size:14px;
    color:#ecfdff;
    margin:0 0 10px;
";

$dividerStyle = "
    border:none;
    border-top:1px solid {$secondaryColor}33;
    margin:18px 0;
";

$footerStyle = "
    font-size:11px;
    color:#8abfd0;
    margin-top:16px;
";

$buttonStyle = "
    display:inline-block;
    margin-top:16px;
    padding:8px 18px;
    border-radius:999px;
    background:linear-gradient(135deg, {$primaryColor}, {$secondaryColor});
    color:#02060a;
    text-decoration:none;
    font-size:13px;
    font-weight:600;
";

// =============== ADMIN EMAIL (HTML) ===============
$adminSubject = 'New Contact Enquiry - Easein Studio';

$adminBodyHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Enquiry - Easein Studio</title>
</head>
<body style="$wrapperStyle">
  <div style="$cardStyle">
    <div style="$logoRowStyle">
      <div>
        <img src="$logoUrl" alt="Easein Studio" style="height:32px;display:block;">
      </div>
      <div style="$badgeStyle">New enquiry</div>
    </div>

    <h1 style="$h1Style">New contact enquiry received</h1>

    <div style="$metaStyle">
      Submitted at <strong>$submittedAt</strong>
    </div>

    <div style="margin-bottom:14px;">
      <p style="$labelStyle">Name</p>
      <p style="$valueStyle">$name</p>

      <p style="$labelStyle">Email</p>
      <p style="$valueStyle">$email</p>

      <p style="$labelStyle">Phone</p>
      <p style="$valueStyle">$phone</p>

      <p style="$labelStyle">Type of Video</p>
      <p style="$valueStyle">$videoTypeLabel</p>
    </div>

    <hr style="$dividerStyle" />

    <div>
      <p style="$labelStyle">Project Details</p>
      <p style="$valueStyle">$projectDetailsHtml</p>
    </div>

    <a href="mailto:$email" style="$buttonStyle">
      Reply to client
    </a>

    <div style="$footerStyle">
      This email was automatically generated from the Easein Studio contact form.
    </div>
  </div>
</body>
</html>
HTML;

// Admin TEXT version
$adminBodyText = "New contact enquiry\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Type of Video: {$videoTypeLabel}\n"
    . "Project Details:\n{$projectDetails}\n"
    . "Submitted At: {$submittedAt}\n";

// =============== USER EMAIL (HTML) ===============
$userSubject = 'We received your enquiry - Easein Studio';

$userBodyHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>We received your enquiry - Easein Studio</title>
</head>
<body style="$wrapperStyle">
  <div style="$cardStyle">
    <div style="$logoRowStyle">
      <div>
        <img src="$logoUrl" alt="Easein Studio" style="height:32px;display:block;">
      </div>
      <div style="$badgeStyle">Enquiry received</div>
    </div>

    <h1 style="$h1Style">Thanks for reaching out, $name 👋</h1>

    <div style="$metaStyle">
      We’ve received your enquiry and our team will get back to you within 24 hours.
    </div>

    <div style="margin-bottom:14px;">
      <p style="$labelStyle">Type of Video</p>
      <p style="$valueStyle">$videoTypeLabel</p>

      <p style="$labelStyle">Phone</p>
      <p style="$valueStyle">$phone</p>
    </div>

    <hr style="$dividerStyle" />

    <div>
      <p style="$labelStyle">Your message</p>
      <p style="$valueStyle">$projectDetailsHtml</p>
    </div>

    <p style="$footerStyle">
      If any detail needs correction, you can simply reply to this email.<br>
      — Easein Studio Team
    </p>
  </div>
</body>
</html>
HTML;

// User TEXT version
$userBodyText = "Hi {$name},\n\n"
    . "Thank you for reaching out to Easein Studio!\n"
    . "We’ve received your enquiry and will get back to you within 24 hours.\n\n"
    . "Summary of your request:\n"
    . "- Type of Video: {$videoTypeLabel}\n"
    . "- Phone: {$phone}\n\n"
    . "Your message:\n{$projectDetails}\n\n"
    . "Best regards,\nEasein Studio Team\n";

// -------- PHPMailer setup function --------
function setupMailer($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName) {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    
    // Set encryption based on port
    if ($smtpPort == 465) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }
    
    $mail->Port       = $smtpPort;
    $mail->SMTPDebug  = 0; // Set to 2 for debugging
    $mail->Debugoutput = 'error_log';

    $mail->setFrom($fromEmail, $fromName);
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    return $mail;
}

// -------- Send emails --------
try {
    // 1) Admin email
    $mailAdmin = setupMailer($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName);
    $mailAdmin->addAddress($adminEmail, $adminName);
    $mailAdmin->addReplyTo($email, $name);
    $mailAdmin->Subject = $adminSubject;
    $mailAdmin->Body    = $adminBodyHtml;
    $mailAdmin->AltBody = $adminBodyText;

    if ($fileAttached && $filePath !== '') {
        $mailAdmin->addAttachment($filePath, $fileName);
    }

    $mailAdmin->send();

    // 2) User confirmation email
    $mailUser = setupMailer($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName);
    $mailUser->addAddress($email, $name);
    $mailUser->Subject = $userSubject;
    $mailUser->Body    = $userBodyHtml;
    $mailUser->AltBody = $userBodyText;
    $mailUser->send();

    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully. We will get back to you soon.'
    ]);
    exit;

} catch (Exception $e) {
    // Try alternative port (587) if 465 fails
    try {
        error_log('Port 465 failed, retrying with port 587...');
        
        $mailAdmin = setupMailer($smtpHost2, $smtpPort2, $smtpUser, $smtpPass, $fromEmail, $fromName);
        $mailAdmin->addAddress($adminEmail, $adminName);
        $mailAdmin->addReplyTo($email, $name);
        $mailAdmin->Subject = $adminSubject;
        $mailAdmin->Body    = $adminBodyHtml;
        $mailAdmin->AltBody = $adminBodyText;

        if ($fileAttached && $filePath !== '') {
            $mailAdmin->addAttachment($filePath, $fileName);
        }

        $mailAdmin->send();

        $mailUser = setupMailer($smtpHost2, $smtpPort2, $smtpUser, $smtpPass, $fromEmail, $fromName);
        $mailUser->addAddress($email, $name);
        $mailUser->Subject = $userSubject;
        $mailUser->Body    = $userBodyHtml;
        $mailUser->AltBody = $userBodyText;
        $mailUser->send();

        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully. We will get back to you soon.'
        ]);
        exit;
        
    } catch (Exception $e2) {
        // Both ports failed - log and return error
        $errorMsg = $e->getMessage();
        error_log('Mail error (port 465): ' . $errorMsg);
        error_log('Mail error (port 587): ' . $e2->getMessage());

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Email sending failed. Please try again or contact us directly.',
            'debug' => $errorMsg,
            'data' => [
                'error' => $errorMsg
            ]
        ]);
        exit;
    }
}
