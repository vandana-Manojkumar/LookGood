# AI-Powered Codebase Analysis with LiteLLM

## Overview

This application includes **AI-powered analysis** using **LiteLLM** - a unified interface for multiple AI providers including:
- **OpenAI** (GPT-4, GPT-4o, GPT-3.5)
- **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- **Azure OpenAI**
- **Google** (Gemini Pro)
- **AWS Bedrock**
- **100+ other models**

### Why LiteLLM?
- ✅ **Unified API** - One interface for all providers
- ✅ **Virtual Keys** - Single key for multiple providers
- ✅ **Cost Tracking** - Monitor usage across providers
- ✅ **Fallbacks** - Auto-switch if one provider fails
- ✅ **Load Balancing** - Distribute requests across models
- ✅ **Rate Limiting** - Built-in request management

## Setup

### Option 1: LiteLLM Virtual Key (Recommended)

Use LiteLLM's unified virtual key to access multiple AI providers:

1. **Get LiteLLM Virtual Key**
   - If you have a LiteLLM proxy setup, use your virtual key
   - Or use LiteLLM.ai service for managed access

2. **Configure Environment Variable**

**Windows PowerShell:**
```powershell
$env:LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
```

**Linux/Mac:**
```bash
export LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
```

3. **Optional: Configure Model**
```powershell
# Use any LiteLLM supported model
$env:AI_MODEL="gpt-4o-mini"  # or "claude-3-sonnet", "gemini-pro", etc.
```

4. **Optional: LiteLLM Proxy URL**
```powershell
# If using self-hosted LiteLLM proxy
$env:LITELLM_BASE_URL="http://localhost:4000"
```

### Option 2: Direct OpenAI API Key

If you prefer to use OpenAI directly without LiteLLM:

1. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create API key

2. **Configure Environment Variable**
```powershell
$env:OPENAI_API_KEY="sk-your-openai-api-key-here"
```

### 3. Start the Application

```powershell
npm run dev
```

The app will automatically detect your configuration:
- ✓ **AI Service enabled with LiteLLM** - Using virtual key for multi-provider access
- ✓ **AI Service enabled with OpenAI** - Using direct OpenAI integration
- ⚠ **AI Service disabled** - No API key configured (app works normally with rule-based descriptions)

## How AI Analysis Works

### Function Analysis
When analyzing a repository, the AI:
1. Examines each function's code, parameters, and return type
2. Generates a clear, concise description (1 sentence)
3. Explains its purpose and role in the application
4. Assesses complexity level (low/medium/high)

**Example:**
```typescript
// Function: getUserById(id: string): Promise<User>
// AI Description: "Retrieves a user record from the database by their unique identifier"
// Purpose: "Provides user data access layer for authentication and profile features"
// Complexity: "medium"
```

### File Analysis
For each code file, the AI:
1. Analyzes the entire file content
2. Describes what the file does
3. Identifies its purpose in the codebase
4. Lists 2-3 key components or exports

**Example:**
```typescript
// File: user-service.ts
// Description: "Service layer handling user-related business logic and data operations"
// Purpose: "Centralizes user management functionality including CRUD operations and validation"
// Key Components: ["UserService", "createUser", "validateUserData"]
```

### Codebase Insights (Future Enhancement)
The AI can analyze the overall structure to provide:
- Overall purpose of the repository
- Architecture pattern/framework identification
- Main components and modules

## Available Models

With LiteLLM, you can use any of these models:

### OpenAI Models
- `gpt-4o` - Latest, most capable (recommended for complex analysis)
- `gpt-4o-mini` - Fast and affordable (default)
- `gpt-4-turbo` - Previous generation
- `gpt-3.5-turbo` - Fastest, cheapest

### Anthropic Models
- `claude-3-opus-20240229` - Most capable Claude model
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-haiku-20240307` - Fast and efficient

### Google Models
- `gemini-pro` - Google's flagship model
- `gemini-1.5-pro` - Enhanced capabilities

### Azure OpenAI
- `azure/gpt-4o` - Azure-hosted GPT-4o
- `azure/gpt-35-turbo` - Azure-hosted GPT-3.5

**Configure model:**
```powershell
$env:AI_MODEL="claude-3-sonnet-20240229"
```

## Cost Considerations

Costs vary by model and provider:

### Using GPT-4o-mini (Default, Most Affordable)
- Small repo (100 functions): ~$0.01 - $0.05
- Medium repo (500 functions): ~$0.05 - $0.25
- Large repo (2000 functions): ~$0.20 - $1.00

### Using Claude 3 Haiku (Fast & Affordable)
- Small repo: ~$0.02 - $0.08
- Medium repo: ~$0.10 - $0.40
- Large repo: ~$0.40 - $1.50

### Using GPT-4o or Claude 3 Sonnet (Premium)
- Small repo: ~$0.10 - $0.30
- Medium repo: ~$0.50 - $1.50
- Large repo: ~$2.00 - $6.00

💡 **Tip:** Start with `gpt-4o-mini` for best cost/performance balance!

## Features

### Batch Processing
- Functions are analyzed in batches of 10 to optimize API calls
- Rate limiting (500ms between batches) prevents API throttling

### Graceful Degradation
- If `OPENAI_API_KEY` is not set, the app uses rule-based descriptions
- If AI analysis fails, it falls back to heuristic-based descriptions
- No errors or failures when AI is unavailable

### Smart Truncation
- Large files are truncated to 8000 characters for analysis
- Function code is limited to 500 characters per function
- Ensures token limits are respected

## Disabling AI Analysis

To disable AI analysis:

**Temporarily (current session):**
```powershell
Remove-Item Env:OPENAI_API_KEY
```

**Permanently:**
Remove the `OPENAI_API_KEY` environment variable from your system settings.

## PDF Export

AI-generated descriptions automatically appear in PDF exports:
- Function descriptions are more intelligent and context-aware
- File purposes provide better documentation
- "What it does" and "How it helps" sections use AI insights when available

## Troubleshooting

### "AI Service disabled" message
- Check that `LITELLM_API_KEY` or `OPENAI_API_KEY` is set correctly
- Verify the key starts with `sk-`
- Restart the application after setting the variable

### Using LiteLLM Proxy
If you have a self-hosted LiteLLM proxy:
```powershell
$env:LITELLM_BASE_URL="http://localhost:4000"
$env:LITELLM_API_KEY="sk-your-proxy-key"
```

### Model Not Found Error
- Verify model name matches LiteLLM format (e.g., `gpt-4o-mini`, `claude-3-sonnet-20240229`)
- Check your API key has access to the requested model
- Try default model by unsetting `AI_MODEL`

### API Rate Limits
- The app includes automatic rate limiting
- Exponential backoff handles temporary failures
- Large repositories may take longer to process
- Consider using faster models like `gpt-4o-mini` or `claude-3-haiku`

### High Costs
- Consider using a smaller test repository first
- Monitor your OpenAI usage at https://platform.openai.com/usage
- Set spending limits in OpenAI dashboard

## Technical Details

### LiteLLM Integration
- **Library**: `litellm` npm package
- **Default Model**: `gpt-4o-mini`
- **Temperature**: 0.3 (focused, deterministic responses)
- **Max Tokens**: 500-2000 depending on task
- **Supported Providers**: OpenAI, Anthropic, Azure, Google, AWS Bedrock, and 100+ more

### Configuration Priority
1. `LITELLM_API_KEY` - Preferred (supports multiple providers)
2. `OPENAI_API_KEY` - Fallback (OpenAI only)
3. If neither set - Uses rule-based descriptions

### API Calls
- Function analysis: 1 call per 10 functions
- File analysis: 1 call per file (only for code files <100KB)
- Codebase analysis: 1 call per repository (optional)

### Error Handling
- All AI calls are wrapped in try-catch blocks
- Errors are logged but don't stop the analysis
- Falls back to non-AI descriptions on failure

## LiteLLM Benefits

### Multi-Provider Support
Switch between providers without code changes:
```powershell
# Use OpenAI
$env:AI_MODEL="gpt-4o-mini"

# Use Anthropic
$env:AI_MODEL="claude-3-haiku-20240307"

# Use Google
$env:AI_MODEL="gemini-pro"
```

### Cost Optimization
- Start with affordable models (`gpt-4o-mini`, `claude-3-haiku`)
- Upgrade to premium models for better quality
- Monitor costs across all providers

### Reliability
- Automatic fallback between providers
- Rate limit handling across different APIs
- Unified error handling

## Future Enhancements

Potential improvements:
- [ ] Codebase-wide architecture analysis
- [ ] Security vulnerability detection
- [ ] Code quality suggestions
- [ ] Dependency risk assessment
- [ ] Documentation completeness scoring
- [ ] Support for other AI providers (Anthropic, Azure OpenAI)
