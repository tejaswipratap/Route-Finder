<?php
/**
 * Route Finder - Shortest Path Visualizer
 * Database Configuration & Auto-Initializer
 * 
 * Configures PDO MySQL connection with auto-setup feature.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'route_finder');
define('DB_USER', 'root');
define('DB_PASS', '');

class Database {
    private static ?PDO $instance = null;
    private static bool $isConnected = false;
    private static ?string $lastError = null;

    public static function getConnection(): ?PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        try {
            // First attempt to connect directly to the target database
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            self::$isConnected = true;
            return self::$instance;
        } catch (PDOException $e) {
            // Database might not exist yet; try auto-initializing
            try {
                $rawDsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
                $pdoRaw = new PDO($rawDsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);
                
                $sqlFile = __DIR__ . '/../database/schema.sql';
                if (file_exists($sqlFile)) {
                    $sql = file_get_contents($sqlFile);
                    $pdoRaw->exec($sql);
                    
                    // Reconnect to newly created database
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);
                    self::$isConnected = true;
                    return self::$instance;
                }
            } catch (PDOException $ex) {
                self::$lastError = $ex->getMessage();
                self::$isConnected = false;
                return null;
            }
        }

        return null;
    }

    public static function isConnected(): bool {
        if (self::$instance === null) {
            self::getConnection();
        }
        return self::$isConnected;
    }

    public static function getLastError(): ?string {
        return self::$lastError;
    }
}

// Global Database Connection Handle
$pdo = Database::getConnection();
?>
