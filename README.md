# CV Builder

A modern, web-based CV/resume builder that uses YAML configuration to generate professional documents. Built with React, TypeScript, and Tailwind CSS.

## Features

- **YAML-based Configuration**: Define your CV structure and content using simple YAML files
- **Live Preview**: See changes in real-time as you edit
- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Dynamic Components**: Modular component system for different CV sections
- **Responsive Design**: Works on desktop and mobile devices
- **PDF Export**: Generate print-ready PDF versions of your CV
- **Customizable Styling**: Adjust font size and layout preferences
- **Debug Mode**: Inspect rendered components and structure

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Editor**: Monaco Editor (VS Code editor)
- **Parsing**: js-yaml for YAML processing
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library

## Project Structure

```
src/
├── assets/defaultDocuments/    # Default CV templates and components
├── components/                # React components
│   ├── EditorPanel/          # Main editor interface
│   ├── ui/                   # Reusable UI components
│   └── ...                   # Other components
├── contexts/                 # React contexts for state management
├── core/parsers/             # YAML parsing and component building logic
├── hooks/                    # Custom React hooks
└── utils/                    # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cv-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Usage

### Creating a CV

1. **Document Structure**: Define your CV layout in `document.yml`:
```yaml
document:
  style: p-3 flex flex-col gap-2
  body:
    - headline
    - education
    - experience
```

2. **Content**: Add your actual content in `main.yml`:
```yaml
headline:
  name: Your Name
  email: your.email@example.com
  github: your-github
  linkedin: your-linkedin

experiences:
  - company: Company Name
    date: 2023-Present
    position: Your Position
    type: Remote
    description:
      - li: Your responsibility
      - li: Another responsibility
```

### Editor Features

- **File Explorer**: Navigate between YAML files
- **Syntax Highlighting**: Monaco editor with YAML support
- **Hotkeys**:
  - `Ctrl+S` - Save
  - `Ctrl+O` - Open document
  - `Ctrl+?` - Help
  - `Ctrl+B` - Toggle sidebar
- **Font Size Control**: Adjust text size in the preview
- **One Page View**: Toggle between single-page and scrollable views

### Custom Components

The application supports dynamic component creation. Components are defined in YAML and rendered dynamically:

- **Headline**: Personal information section
- **Experience**: Work experience entries
- **Education**: Educational background
- **UI Components**: Reusable elements (lists, sections, etc.)

## Documentation

For detailed information about the YAML component system, including:

- Component creation and composition
- Inheritance and templates
- Variable substitution and props
- Advanced features and examples

📖 **See [YAML Component System Documentation](docs/yaml-component-system.md)**

## Deployment

The project includes GitHub Pages deployment configuration:

1. Push to `main` branch to trigger automatic deployment
2. The built application will be available at your GitHub Pages URL

## Development

### Adding New Components

1. Create component YAML definition in `src/assets/defaultDocuments/components/`
2. The component will be automatically available in the document builder
3. Use existing components as templates for structure and styling

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run build  # Includes TypeScript compilation
```

## License

This project is private and proprietary.

## Contributing

Contact the project maintainer for contribution guidelines.