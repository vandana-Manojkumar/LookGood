# Design Guidelines: Codebase Analysis & Documentation Platform

## Design Approach

**Reference-Based Approach** drawing from developer tools: GitHub, Linear, GitLab, and VS Code Web
- Prioritize information density and scan-ability
- Focus on code readability and hierarchical data presentation
- Emphasize clear navigation through complex repository structures

## Core Design Principles

1. **Information Hierarchy First**: Multi-level content organization (repo → folder → file → function)
2. **Developer-Optimized Typography**: Monospace for code, sans-serif for UI
3. **Spatial Efficiency**: Maximize screen real estate for content
4. **Scannable Layouts**: Clear visual separation between sections

## Typography System

**Primary Font**: Inter or SF Pro (UI elements, headings, descriptions)
**Code Font**: JetBrains Mono or Fira Code (all code snippets, file paths, function names)

Hierarchy:
- Page Titles: text-2xl font-semibold
- Section Headers: text-lg font-medium
- Subsection Headers: text-base font-medium
- Body Text: text-sm
- Code Snippets: text-sm font-mono
- Metadata/Labels: text-xs text-gray-500

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)

**Primary Layout**: 3-Column Dashboard
- Left Sidebar (w-64): Repository tree/folder navigation
- Main Content (flex-1): File/function details, documentation viewer
- Right Sidebar (w-80, collapsible): Metadata panel (git history, dependencies, version info)

**Mobile**: Stack to single column, hamburger navigation for sidebars

## Component Library

### Navigation Components

**Repository Sidebar**
- Collapsible tree structure with folder/file icons
- Indent nested items with pl-4 increments
- Hover states for interactive items
- Active item highlighted with subtle background
- Search bar at top (sticky position)

**Breadcrumb Navigation**
- Path: Repo > Folder > File > Function
- Clickable segments with separator icons
- Truncate long paths with tooltips

### Content Display Components

**Code Viewer Panel**
- Syntax-highlighted code blocks with line numbers
- Copy button (top-right corner)
- Expand/collapse functionality for long files
- Function outline sidebar within panel

**Function Documentation Card**
- Border: border border-gray-200, rounded-lg
- Padding: p-6
- Sections: Name (heading), Parameters (list), Returns (inline), Dependencies (tags), Description (paragraph)
- Spacing between sections: space-y-4

**Version Timeline**
- Vertical timeline with commit markers
- Date stamps on left, changes on right
- Expandable commit details
- Visual indicators for added/modified/removed items

**Module Interaction Diagram**
- Node-based flow visualization
- Arrows showing dependencies
- Clickable nodes linking to module details

### Data Display

**Metadata Grid**
- 2-column key-value pairs
- Grid layout: grid grid-cols-2 gap-4
- Labels: text-sm font-medium
- Values: text-sm font-mono (for paths/technical data)

**Stats Dashboard**
- Cards with icon + number + label
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Metrics: Total Files, Functions, Modules, Commits
- Padding: p-6 per card

**Tables** (for file listings, function inventories)
- Striped rows for readability
- Sortable column headers
- Compact row height: py-3
- Sticky header on scroll

### Forms & Inputs

**Search Bar**
- Full-width with icon prefix
- Rounded: rounded-lg
- Padding: px-4 py-2
- Placeholder: "Search files, functions, or commits..."

**Filter Panel**
- Checkbox groups for file types
- Date range pickers for git history
- Tag-based filtering (multi-select)
- Apply/Reset buttons at bottom

### Overlays

**Modal for Full Documentation View**
- Max width: max-w-4xl
- Padding: p-8
- Scrollable content area
- Close button (top-right)

**Tooltip** (for truncated text, metadata)
- Small: px-3 py-2
- Text: text-xs
- Positioned contextually

## Page Layouts

### Main Dashboard
- Hero-free design
- Top bar: Repository name + stats + action buttons (Export, Settings)
- 3-column layout as described
- No hero image needed - immediate utility focus

### Repository Analysis View
- Breadcrumb navigation at top
- Split view: File tree (left 30%) + Content (right 70%)
- Tabbed interface in content area: Overview, Files, Functions, Git History, Dependencies

### Function Detail View
- Full-width documentation card
- Related functions sidebar (right)
- Usage examples section below
- Git history for this function (timeline)

## Spacing Strategy

**Consistent Padding**:
- Page containers: px-6 py-8
- Cards/Panels: p-6
- Sections: space-y-8
- List items: py-3
- Tight groupings: space-y-2

**Margins**:
- Section separation: mb-8
- Component groups: mb-6
- Related items: mb-4

## Images

**No hero images** - This is a developer tool focused on functionality.

**Icon Usage**: 
- Heroicons (outline style) via CDN for UI elements
- File type icons for repository tree
- Git branch/commit icons for version history
- Dependency/connection icons for module diagrams

All icons: w-5 h-5 for standard size, w-4 h-4 for compact contexts