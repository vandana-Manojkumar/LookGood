# Test UKG LiteLLM Proxy Connection

## 🧪 Curl Test Command

Test your LiteLLM API key with the UKG internal proxy:

```powershell
# PowerShell - Test with Claude Sonnet 4
curl https://sdlc-llm.ukg.int/v1/chat/completions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer your-api-key-here" `
  -d '{
    "model": "claude-sonnet-4",
    "messages": [
      {
        "role": "user",
        "content": "Say hello and confirm the API is working!"
      }
    ],
    "max_tokens": 50
  }'
```

## 🔧 PowerShell Test Script

Save and run this script to test your connection:

```powershell
# test-litellm.ps1
$apiKey = "your-api-key-here"  # Replace with your actual key
$baseUrl = "https://sdlc-llm.ukg.int"
$model = "claude-sonnet-4"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $apiKey"
}

$body = @{
    model = $model
    messages = @(
        @{
            role = "user"
            content = "Test message - respond with 'API working!'"
        }
    )
    max_tokens = 50
} | ConvertTo-Json -Depth 10

Write-Host "Testing UKG LiteLLM Proxy..." -ForegroundColor Cyan
Write-Host "URL: $baseUrl/v1/chat/completions" -ForegroundColor Gray
Write-Host "Model: $model" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod `
        -Uri "$baseUrl/v1/chat/completions" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 30
    
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host $response.choices[0].message.content
    Write-Host ""
    Write-Host "Model Used: $($response.model)" -ForegroundColor Gray
    Write-Host "Tokens Used: $($response.usage.total_tokens)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Error!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}
```

## 📝 Quick Setup

1. **Set your API key:**
   ```powershell
   $env:LITELLM_API_KEY="your-actual-api-key-here"
   ```

2. **The proxy URL is already configured (defaults to UKG):**
   ```powershell
   # Already set to: https://sdlc-llm.ukg.int
   # No need to set LITELLM_BASE_URL unless changing
   ```

3. **Model is pre-configured:**
   ```powershell
   # Defaults to: claude-sonnet-4
   # Change if needed:
   $env:AI_MODEL="claude-sonnet-4-5"
   ```

4. **Start the app:**
   ```powershell
   npm run dev
   ```

## 🎯 Expected Success Response

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1705248000,
  "model": "claude-sonnet-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "API working!"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 4,
    "total_tokens": 16
  }
}
```

## ⚠️ Common Errors

### 401 Unauthorized
```json
{"error": {"message": "Invalid API key", "type": "invalid_request_error"}}
```
**Fix:** Check your LITELLM_API_KEY is correct

### 404 Model Not Found
```json
{"error": {"message": "Model not found", "type": "invalid_request_error"}}
```
**Fix:** Use "claude-sonnet-4" (not "vertex_ai/claude-sonnet-4-5@20250929")

### Connection Timeout
```
Invoke-RestMethod: The operation has timed out.
```
**Fix:** Check network connection to UKG internal network

## 🚀 Run App with Your Key

```powershell
# Set your API key
$env:LITELLM_API_KEY="your-api-key-here"

# Optional: Use different model
$env:AI_MODEL="claude-sonnet-4"

# Start the application
npm run dev
```

You should see:
```
✓ AI Service enabled with LiteLLM (model: claude-sonnet-4)
  Using proxy: https://sdlc-llm.ukg.int
```

## 📊 Available Models

Based on your UKG LiteLLM setup:
- `claude-sonnet-4` - Claude Sonnet 4 (recommended)
- `claude-sonnet-4-5` - Claude Sonnet 4.5 (if available)

The internal model mapping (`vertex_ai/claude-sonnet-4-5@20250929`) is handled by the LiteLLM proxy - just use the public name!
