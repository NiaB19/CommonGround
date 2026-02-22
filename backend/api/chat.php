<?php
// 1. KILL ANY HIDDEN SPACES OR WARNINGS
ob_start();

// 2. HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// 3. SILENCE DISPLAY ERRORS (keeps them out of the JSON)
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    // 4. PATHS (Matching your terminal: /frontend/backend/api/chat.php)
    $rootDir = dirname(__DIR__, 3); 
    $autoload = $rootDir . '/vendor/autoload.php';
    
    if (!file_exists($autoload)) {
        throw new Exception("Vendor folder not found at: " . $autoload);
    }
    require_once $autoload;

    // 5. LOAD ENV
    if (file_exists($rootDir . '/.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable($rootDir);
        $dotenv->load();
    }

    // 6. INPUT
    $input = json_decode(file_get_contents('php://input'), true);
    $userMessage = $input['message'] ?? '';
    $apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY');

    if (!$apiKey) throw new Exception("API Key missing in .env");

    // 7. GEMINI CALL
    $client = Gemini::client($apiKey);
    $result = $client->generativeModel(model: 'gemini-1.5-flash')->generateContent($userMessage);

    // 8. WIPE BUFFER & SEND CLEAN JSON
    ob_end_clean(); 
    echo json_encode([
        "status" => "success",
        "response" => $result->text()
    ]);

} catch (Exception $e) {
    // WIPE BUFFER & SEND ERROR JSON
    if (ob_get_length()) ob_end_clean();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
exit;