# Documentation

This folder contains documentation for the CV Builder project.

## Files

- `yaml-component-system.md` - Comprehensive guide to the YAML component system
- `README.md` - This file

## Accessing Documentation

Documentation can be accessed in two ways:

1. **In the Application**: Press `Ctrl+D` in the editor to open the documentation viewer
2. **Directly**: Open the markdown files in any markdown viewer

## Adding New Documentation

To add new documentation:

1. Create a new `.md` file in this folder
2. Update the documentation viewer to include the new file
3. Copy the file to `public/docs/` for production access

## Documentation System

The documentation is powered by a custom React hook (`useDocumentation`) that:

- Fetches markdown files from the docs folder
- Provides loading and error states
- Integrates with the Monaco editor for syntax highlighting
- Supports hot-reloading during development