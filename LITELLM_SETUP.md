# LiteLLM Integration - Quick Setup

## ✅ Integration Complete!

Your app now uses **LiteLLM** for AI-powered code analysis, supporting 100+ AI models from multiple providers!

## 🎯 What You Get

### Supported AI Providers
- ✅ **OpenAI** (GPT-4, GPT-4o, GPT-3.5)
- ✅ **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- ✅ **Google** (Gemini Pro, Gemini 1.5)
- ✅ **Azure OpenAI**
- ✅ **AWS Bedrock**
- ✅ **100+ other models**

### Key Benefits
- 🔑 **Single Virtual Key** - Access all providers
- 💰 **Cost Tracking** - Monitor usage across providers
- 🔄 **Auto Fallbacks** - Switch providers if one fails
- ⚡ **Load Balancing** - Distribute requests
- 📊 **Unified API** - One interface for all

## 🚀 Quick Start with Your Virtual Key

### Step 1: Set Your LiteLLM Virtual Key

```powershell
# Windows PowerShell
$env:LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
```

```bash
# Linux/Mac
export LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
```

### Step 2: (Optional) Choose Your Model

```powershell
# Use GPT-4o-mini (default - fast & affordable)
$env:AI_MODEL="gpt-4o-mini"

# Or use Claude 3 Haiku (fast & affordable)
$env:AI_MODEL="claude-3-haiku-20240307"

# Or use Claude 3 Sonnet (balanced)
$env:AI_MODEL="claude-3-sonnet-20240229"

# Or use GPT-4o (premium quality)
$env:AI_MODEL="gpt-4o"
```

### Step 3: (Optional) Configure Proxy URL

If you're using a self-hosted LiteLLM proxy:

```powershell
$env:LITELLM_BASE_URL="http://localhost:4000"
```

### Step 4: Start the App

```powershell
npm run dev
```

**Look for this message:**
```
✓ AI Service enabled with LiteLLM (model: gpt-4o-mini)
  Using proxy: http://localhost:4000  (if configured)
```

## 📊 Model Recommendations

### For Best Cost/Performance (Recommended)
```powershell
$env:AI_MODEL="gpt-4o-mini"        # OpenAI - Fast, cheap, accurate
$env:AI_MODEL="claude-3-haiku-20240307"  # Anthropic - Very fast, affordable
```

### For Best Quality
```powershell
$env:AI_MODEL="gpt-4o"             # OpenAI - Latest, most capable
$env:AI_MODEL="claude-3-opus-20240229"   # Anthropic - Highest quality
```

### For Good Balance
```powershell
$env:AI_MODEL="claude-3-sonnet-20240229" # Anthropic - Great balance
$env:AI_MODEL="gemini-pro"         # Google - Good performance
```

## 💰 Estimated Costs

### Using Affordable Models (gpt-4o-mini, claude-3-haiku)
- Small repo (100 functions): $0.01 - $0.08
- Medium repo (500 functions): $0.05 - $0.40
- Large repo (2000 functions): $0.20 - $1.50

### Using Premium Models (gpt-4o, claude-3-opus)
- Small repo: $0.10 - $0.50
- Medium repo: $0.50 - $2.00
- Large repo: $2.00 - $8.00

## 🔧 Configuration Options

### Environment Variables

```powershell
# Required: Your LiteLLM virtual key
$env:LITELLM_API_KEY="sk-your-key"

# Optional: Model selection (default: gpt-4o-mini)
$env:AI_MODEL="gpt-4o-mini"

# Optional: LiteLLM proxy URL
$env:LITELLM_BASE_URL="http://localhost:4000"

# Alternative: Direct OpenAI key (if not using LiteLLM)
$env:OPENAI_API_KEY="sk-your-openai-key"
```

### Persistent Configuration (Windows)

1. Search for "Environment Variables" in Windows
2. Click "New" under User variables
3. Add these variables:
   - Name: `LITELLM_API_KEY`, Value: `sk-your-key`
   - Name: `AI_MODEL`, Value: `gpt-4o-mini` (optional)
4. Restart your terminal

## 🎨 What Changed

### Files Modified
1. ✅ **`server/ai-service.ts`** - Now uses LiteLLM instead of OpenAI directly
   - Supports multiple providers
   - Configurable model selection
   - Proxy support

2. ✅ **`AI_INTEGRATION.md`** - Updated with LiteLLM documentation
3. ✅ **`.env.example`** - Added LiteLLM configuration options
4. ✅ **`package.json`** - Added `litellm` package

### Backward Compatible
- Still supports direct `OPENAI_API_KEY` if you don't have LiteLLM
- Falls back to rule-based descriptions if no API key
- All existing features work unchanged

## 🧪 Testing Different Models

Try different models to see which works best:

```powershell
# Test with OpenAI
$env:AI_MODEL="gpt-4o-mini"
npm run dev
# Analyze a repo...

# Test with Anthropic
$env:AI_MODEL="claude-3-haiku-20240307"
npm run dev
# Analyze same repo and compare results...

# Test with Google
$env:AI_MODEL="gemini-pro"
npm run dev
# Compare again...
```

## 📖 Full Model List

### OpenAI
- `gpt-4o` - Latest flagship
- `gpt-4o-mini` - Affordable version (default)
- `gpt-4-turbo` - Previous gen
- `gpt-3.5-turbo` - Fastest

### Anthropic
- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced
- `claude-3-haiku-20240307` - Fast

### Google
- `gemini-pro` - Flagship
- `gemini-1.5-pro` - Enhanced

### Azure OpenAI
- `azure/gpt-4o`
- `azure/gpt-35-turbo`

## 🐛 Troubleshooting

### "AI Service disabled" message
```powershell
# Check if variable is set
echo $env:LITELLM_API_KEY

# Set it if not
$env:LITELLM_API_KEY="sk-your-key"

# Restart the app
npm run dev
```

### Model not found
```powershell
# Verify model name format
$env:AI_MODEL="gpt-4o-mini"  # Correct
$env:AI_MODEL="gpt4omini"    # Wrong (no hyphens)

# Or remove to use default
Remove-Item Env:AI_MODEL
```

### Using LiteLLM Proxy
```powershell
# Set proxy URL
$env:LITELLM_BASE_URL="http://localhost:4000"
$env:LITELLM_API_KEY="sk-your-proxy-key"

# Verify it's being used
npm run dev
# Should see: "Using proxy: http://localhost:4000"
```

## 📚 Next Steps

1. **Set your virtual key** and start the app
2. **Analyze a test repository** to see AI descriptions
3. **Try different models** to find the best fit
4. **Monitor costs** through your LiteLLM dashboard
5. **Read full documentation** in `AI_INTEGRATION.md`

## 🎉 Benefits Over Direct OpenAI

### Before (OpenAI only)
- ❌ Locked to OpenAI
- ❌ No fallback options
- ❌ Single point of failure
- ❌ Limited cost optimization

### Now (LiteLLM)
- ✅ 100+ models from multiple providers
- ✅ Auto-fallback if one fails
- ✅ Easy cost comparison
- ✅ Single virtual key for all
- ✅ Load balancing across providers

---

**Ready to go! Set your `LITELLM_API_KEY` and start analyzing repositories with AI! 🚀**
