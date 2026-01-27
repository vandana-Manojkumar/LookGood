# 🤖 Repo Insight - AI-Powered Codebase Analyzer

Deep codebase understanding and documentation generator with **AI-powered analysis using LiteLLM**. Transform any GitHub repository into comprehensive documentation with intelligent function descriptions, file purposes, and architecture insights.

## ✨ Features

- 📊 **Complete Repository Analysis** - Extract folder structure, files, functions, and git history
- 🤖 **AI-Powered Descriptions** - Generate intelligent descriptions using LiteLLM (OpenAI, Anthropic, Google, Azure, and 100+ models)
- 🔍 **Function Encyclopedia** - Detailed documentation of every function with parameters and return types
- 📈 **Dependency Graphs** - Visualize module dependencies and imports
- 📜 **Git History** - Track commits, changes, and contributors
- 📄 **PDF Export** - Generate comprehensive PDF documentation
- 🎨 **Interactive Dashboard** - Browse code structure with file tree navigation
- 🌙 **Dark/Light Mode** - Beautiful UI with theme support

## 🚀 Quick Start

### Prerequisites

- Node.js v22+ and npm
- (Optional) OpenAI API key for AI-powered analysis

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Repo-Insight

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

## 🤖 AI Integration (Optional but Recommended)

Enable AI-powered analysis with **LiteLLM** for intelligent code descriptions:

### Supported AI Providers (via LiteLLM)
- ✅ **OpenAI** (GPT-4o, GPT-4o-mini, GPT-3.5)
- ✅ **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
- ✅ **Google** (Gemini Pro, Gemini 1.5)
- ✅ **Azure OpenAI**
- ✅ **AWS Bedrock**
- ✅ **100+ other models**

### Quick Setup

**Option 1: LiteLLM Virtual Key (Recommended)**
```powershell
# Windows PowerShell - Use your LiteLLM virtual key
$env:LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
$env:AI_MODEL="gpt-4o-mini"  # or claude-3-haiku-20240307, gemini-pro, etc.
npm run dev
```

**Option 2: Direct OpenAI Key**
```powershell
# Windows PowerShell - Use direct OpenAI key
$env:OPENAI_API_KEY="sk-your-openai-key-here"
npm run dev
```

```bash
# Linux/Mac
export LITELLM_API_KEY="sk-your-litellm-virtual-key-here"
export AI_MODEL="gpt-4o-mini"
npm run dev
```

### 3. See the Difference
**Without AI (Rule-based):**
```
Function: getUserById
Description: Retrieves user by id data
```

**With AI (LiteLLM):**
```
Function: getUserById
Description: Retrieves a user record from the database using their unique identifier
Purpose: Provides user data access layer for authentication and profile features
Complexity: medium
```

📚 **Full setup guides:**
- **[LITELLM_SETUP.md](./LITELLM_SETUP.md)** - Quick LiteLLM setup with virtual key
- **[AI_INTEGRATION.md](./AI_INTEGRATION.md)** - Complete AI integration guide

## 📖 Usage

1. **Enter Repository URL**
   - Format: `https://github.com/owner/repo` or `owner/repo`
   - Add GitHub token for private repositories

2. **Analyze**
   - The app fetches and processes the repository
   - With AI enabled: Generates intelligent descriptions
   - Without AI: Uses smart heuristics

3. **Explore**
   - Browse folder structure and files
   - View function details with AI descriptions
   - Analyze dependencies and commit history
   - Export comprehensive PDF documentation

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query (state management)
- shadcn/ui + Radix UI (components)
- Tailwind CSS (styling)
- Framer Motion (animations)

### Backend
- Express.js + TypeScript
- Node.js v22
- In-memory storage (upgradeable to PostgreSQL)
- GitHub REST API integration
- **LiteLLM** (unified AI provider interface)
  - OpenAI, Anthropic, Google, Azure support
  - 100+ models available

### Analysis
- **Code Parsing**: Regex-based function extraction
- **AI Analysis**: LiteLLM with multiple model support (GPT-4o-mini, Claude 3, Gemini, etc.)
- **Rate Limiting**: Smart throttling for API calls
- **Batch Processing**: Efficient bulk analysis

## 🔧 Configuration

### Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
# AI Analysis with LiteLLM (Recommended - supports multiple providers)
LITELLM_API_KEY=sk-your-litellm-virtual-key-here
AI_MODEL=gpt-4o-mini  # or claude-3-haiku-20240307, gemini-pro, etc.

# Optional: LiteLLM Proxy
LITELLM_BASE_URL=http://localhost:4000

# Alternative: Direct OpenAI (if not using LiteLLM)
OPENAI_API_KEY=sk-your-openai-key-here

# GitHub API (Optional - for private repos)
GITHUB_TOKEN=ghp_your-github-token

# Server Configuration
PORT=5000
```

### Cost Considerations

Using LiteLLM with affordable models (gpt-4o-mini, claude-3-haiku):
- Small repo (100 functions): ~$0.01 - $0.08
- Medium repo (500 functions): ~$0.05 - $0.40
- Large repo (2000 functions): ~$0.20 - $1.50

💡 **Tip:** The app works perfectly without AI using smart heuristics!

## 📁 Project Structure

```
Repo-Insight/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── ai-service.ts   # 🤖 AI integration
│   ├── github-client.ts # GitHub API
│   ├── routes.ts       # API endpoints
│   └── storage.ts      # Data layer
├── shared/             # Shared types/schema
└── AI_INTEGRATION.md   # AI setup guide
```

## 🎯 Use Cases

- **Onboarding** - Help new developers understand codebases
- **Documentation** - Auto-generate comprehensive docs
- **Code Review** - Quick overview of repository structure
- **AI Training** - Export PDFs to train AI agents
- **Architecture Analysis** - Understand project patterns
- **Dependency Audit** - Track module relationships

## 🔒 Privacy & Security

- **No data storage** - Analyses are in-memory only
- **GitHub tokens** - Never stored, used only for API calls
- **OpenAI API** - Code sent only when AI is enabled
- **Local processing** - Most analysis happens locally

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - TypeScript type checking

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- [ ] Support for more programming languages
- [ ] Advanced dependency analysis
- [ ] Code quality metrics
- [ ] Security vulnerability detection
- [ ] Support for other AI providers (Anthropic, Azure)
- [ ] Persistent database integration

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [OpenAI](https://openai.com/) (optional)
- GitHub REST API for repository data

---

**Made with ❤️ for developers who love understanding code**

💡 Questions? Issues? Check out [AI_INTEGRATION.md](./AI_INTEGRATION.md) for detailed AI setup
