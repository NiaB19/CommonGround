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
$apiKey = 'AIzaSyA9U7PwrG8IHguI0aGQKCM5sCA6oab354o'; // Get from AI Studio
$client = Gemini::client($apiKey);

// 3. System Instruction: Give the AI the "Social Compass"
$systemInstruction = "
You are 'The Rutgers Local,' a friendly, helpful, and slightly witty student guide. 
Your goal is to help people find 'Third Spaces' (social spots that aren't home or work).

RULES:
1. Use the JSON data provided below to give REAL recommendations.
2. DO NOT just list facts. Explain WHY a place is cool. (e.g., instead of 'It is ADA accessible,' say 'It's super easy to get around if you have a stroller or a wheelchair.')
3. If someone asks for a vibe (like 'quiet' or 'social'), prioritize spots that match.
4. Keep it conversational. Use occasional student slang like 'chill,' 'vibe,' or 'spot.'
5. If a place is in your data, talk about it like you've been there.

DATA: " . $spacesData;
try {
    // 1. Initialize the model
    // Note: Use 'gemini-1.5-flash' for the fastest performance
    $model = $client->generativeModel(model: 'gemini-2.5-flash');

    // 2. Combine the instructions and the user message
    $prompt = $systemInstruction . "\n\nUser says: " . $userMessage;

    // 3. Generate the real response
    $result = $model->generateContent($prompt);
    $realAnswer = $result->text();
    
    echo json_encode([
        "status" => "success", 
        "answer" => $realAnswer
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}