<?php
/**
 * Route Finder - Helper Functions & Utilities
 */

require_once __DIR__ . '/../config/db.php';

/**
 * Send JSON API Response
 */
function sendJsonResponse(bool $success, mixed $data = null, ?string $message = null, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

/**
 * Sanitize string input
 */
function sanitizeInput(string $data): string {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Check if current user is logged in as Admin
 */
function isAdminLoggedIn(): bool {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * Require Admin authentication or send 401/redirect
 */
function requireAdminAuth(bool $isApiCall = true): void {
    if (!isAdminLoggedIn()) {
        if ($isApiCall) {
            sendJsonResponse(false, null, 'Unauthorized access. Admin authentication required.', 401);
        } else {
            header('Location: ../login.php?error=unauthorized');
            exit;
        }
    }
}

/**
 * Get Base URL of the project
 */
function getBaseUrl(): string {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
    $scriptDir = rtrim(str_replace('\\', '/', $scriptDir), '/');
    return $protocol . $host . ($scriptDir ? $scriptDir : '');
}
?>
