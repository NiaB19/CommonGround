<?php
// backend/api/chat.php
require_once __DIR__ . '/../vendor/autoload.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 1. Get User Input & Load Third-Space Data
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? 'Hello';
$spacesData = file_get_contents('../data/spaces.json');

// 2. Set up the AI Client
$apiKey = 'AIzaSyB7f3ShuGV0N26YbMhaFF5wUy8gfl0bJNc'; // Get from AI Studio
$client = Gemini::client($apiKey);

// 3. System Instruction: Give the AI the "Social Compass"
$systemInstruction = "You are the CommonGround Assistant. Use this data about Rutgers spaces to recommend inclusive, non-alcoholic spots: " . $spacesData;

try {
    // COMMENT OUT the real AI call for now
    // $model = $client->generativeModel(model: '...');
    // $response = $model->generateContent(...);
    
    // FAKE a successful response for testing the UI
    $fakeAnswer = "Hey! I'm the CommonGround bot (currently in maintenance mode). Based on my data, I'd recommend checking out the Rutgers Student Center—it's a great non-alcoholic spot!";
    
    echo json_encode([
        "status" => "success", 
        "answer" => $fakeAnswer
    ]);
} catch (Exception $e) {
    // ... rest of your error handling
}