<?php

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set up logging
$logFile = __DIR__ . '/storage/logs/github-webhook.log';
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Get the raw POST data
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

// Verify the webhook signature
$secret = getenv('GITHUB_WEBHOOK_SECRET');
if (empty($secret)) {
    logMessage('Error: GITHUB_WEBHOOK_SECRET not set');
    http_response_code(500);
    die('Webhook secret not configured');
}

$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
if (!hash_equals($expectedSignature, $signature)) {
    logMessage('Error: Invalid webhook signature');
    http_response_code(403);
    die('Invalid signature');
}

// Parse the payload
$data = json_decode($payload, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    logMessage('Error: Invalid JSON payload');
    http_response_code(400);
    die('Invalid JSON payload');
}

// Verify it's a push event to the main branch
if ($_SERVER['HTTP_X_GITHUB_EVENT'] !== 'push' || 
    $data['ref'] !== 'refs/heads/main') {
    logMessage('Ignoring non-push event or non-main branch');
    http_response_code(200);
    die('Ignored');
}

// Execute the deployment script
$deployScript = __DIR__ . '/deploy.sh';
if (!file_exists($deployScript)) {
    logMessage('Error: deploy.sh not found');
    http_response_code(500);
    die('Deployment script not found');
}

// Make sure the script is executable
chmod($deployScript, 0755);

// Execute the script
$output = [];
$returnVar = 0;
exec("$deployScript 2>&1", $output, $returnVar);

// Log the result
if ($returnVar === 0) {
    logMessage('Deployment successful');
    logMessage('Output: ' . implode("\n", $output));
    http_response_code(200);
    echo 'Deployment successful';
} else {
    logMessage('Deployment failed');
    logMessage('Output: ' . implode("\n", $output));
    http_response_code(500);
    echo 'Deployment failed';
} 