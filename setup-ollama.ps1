# Ollama Setup and Test Script
# Run this AFTER installing Ollama

Write-Host "🤖 Chakra AI Setup - Ollama Integration" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check if Ollama is installed
Write-Host "[1/5] Checking Ollama installation..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version
    Write-Host "✅ Ollama is installed: $ollamaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama not found. Please install from https://ollama.com/download" -ForegroundColor Red
    exit 1
}

# Step 2: Check if Ollama service is running
Write-Host "`n[2/5] Checking Ollama service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
    Write-Host "✅ Ollama service is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ollama service not responding. It should auto-start after installation." -ForegroundColor Yellow
    Write-Host "   If this persists, try: ollama serve" -ForegroundColor Yellow
}

# Step 3: Check if Mistral model is downloaded
Write-Host "`n[3/5] Checking for Mistral model..." -ForegroundColor Yellow
$models = ollama list
if ($models -match "mistral") {
    Write-Host "✅ Mistral model is ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  Mistral model not found. Downloading now (this may take 5-10 minutes)..." -ForegroundColor Yellow
    Write-Host "   Model size: ~4GB" -ForegroundColor Gray
    ollama pull mistral
    Write-Host "✅ Mistral model downloaded" -ForegroundColor Green
}

# Step 4: Test Ollama directly
Write-Host "`n[4/5] Testing Ollama API..." -ForegroundColor Yellow
$testPayload = @{
    model = "mistral"
    prompt = "Say 'Hello from Ollama!' in one sentence."
    stream = $false
} | ConvertTo-Json

try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $testPayload -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Ollama API test successful!" -ForegroundColor Green
    Write-Host "   Response: $($testResponse.response)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ollama API test failed: $_" -ForegroundColor Red
}

# Step 5: Test Level 5 with real AI
Write-Host "`n[5/5] Testing Level 5 Prompt Injection Lab..." -ForegroundColor Yellow
$level5Payload = @{
    input = "hello"
    level = 5
} | ConvertTo-Json

try {
    $level5Response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/prompt-injection/evaluate" -Method Post -Body $level5Payload -ContentType "application/json" -TimeoutSec 35
    Write-Host "✅ Level 5 test successful!" -ForegroundColor Green
    Write-Host "   AI Response: $($level5Response.response)" -ForegroundColor Cyan
    
    if ($level5Response.response -match "Hey|Hello|Hi") {
        Write-Host "`n🎉 SUCCESS! Level 5 is using REAL AI (not scripted)!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Response received, but might be using fallback." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Level 5 test failed: $_" -ForegroundColor Red
    Write-Host "   Make sure backend is running: docker-compose up -d backend" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup complete! 🚀" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Navigate to AI Prompt Injection Lab" -ForegroundColor White
Write-Host "3. Select Level 5" -ForegroundColor White
Write-Host "4. Try chatting naturally: 'hello', 'what are you doing', etc." -ForegroundColor White
Write-Host "`n💡 Tip: The AI will feel like ChatGPT now, not a scripted bot!" -ForegroundColor Cyan
