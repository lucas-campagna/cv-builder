# YAML Component System Documentation

The CV Builder uses a powerful YAML-based component system that allows you to create complex, reusable UI components with inheritance, templating, and dynamic content. This system transforms YAML definitions into React components and ultimately HTML.

## Table of Contents

1. [Basic Concepts](#basic-concepts)
2. [Simple Components](#simple-components)
3. [Component Composition](#component-composition)
4. [Variables and Props](#variables-and-props)
5. [Inheritance](#inheritance)
6. [Templates](#templates)
7. [Arrays and Lists](#arrays-and-lists)
8. [Advanced Features](#advanced-features)
9. [Built-in HTML Tags](#built-in-html-tags)

## Basic Concepts

### Component Structure

Every component in YAML has these core properties:

```yaml
componentName:
  from: htmlTagOrOtherComponent  # What this component extends
  style: "tailwind-classes"     # CSS classes
  body: content                  # The content inside
  anyOtherProp: value           # Any HTML attribute
```

### Key Properties

- **`from`**: Specifies the base component (HTML tag or another component)
- **`style`**: Tailwind CSS classes for styling
- **`body`**: The content inside the component
- **Other props**: Any additional HTML attributes (id, onclick, etc.)

## Simple Components

### Basic HTML Element

```yaml
simpleBox:
  from: div
  style: "bg-red-100 p-2"
  body: "Hello World"
```

Renders to:
```html
<div class="bg-red-100 p-2">Hello World</div>
```

### Minimal Component

```yaml
minimal:
  body: "Just text"
```

Renders to:
```html
Just text
```

### Component with HTML Attributes

```yaml
button:
  from: button
  onclick: "alert('Clicked!')"
  body: "Click me"
```

Renders to:
```html
<button onclick="alert('Clicked!')">Click me</button>
```

## Component Composition

### Using Other Components

```yaml
container:
  from: div
  style: "border p-4"
  body:
    from: header
    title: "My Title"

header:
  from: h2
  style: "text-xl font-bold"
  body: "$title"
```

### Nested Components

```yaml
card:
  from: div
  style: "bg-white shadow p-4"
  body:
    - from: h3
      body: "Card Title"
    - from: p
      body: "Card content here"
```

## Variables and Props

### Variable Substitution

Use `$variableName` to substitute values:

```yaml
greeting:
  from: div
  body: "Hello, $name!"
```

Usage: `greeting({ name: "World" })`

Renders to:
```html
<div>Hello, World!</div>
```

### Multiple Variables

```yaml
userCard:
  from: div
  style: "border p-2"
  body:
    - from: h3
      body: "$name"
    - from: p
      body: "$email"
```

### Variable in Style

```yaml
styledBox:
  from: div
  style: "$bgColor $padding"
  body: "Content"
```

## Inheritance

### Basic Inheritance (Child Overwrites Parent)

```yaml
parent:
  from: div
  style: "p-2 border"
  body: "Parent content"

child:
  from: parent
  style: "bg-red-100"  # Overwrites parent's style
  body: "Child content" # Overwrites parent's body
```

### Inheritance with Variable-Based Merging

The key insight is that while child components don't automatically merge with parent properties, parents can explicitly allow merging by using variables in their properties. When the child provides values for these variables, the result is effectively a merge.

```yaml
parent:
  from: div
  style: "p-2 border $style"  # Parent uses $style variable
  body: "Parent: $message"    # Parent uses $message variable

child:
  from: parent
  style: "bg-red-100"         # Child provides value for $style
  message: "Child content"    # Child provides value for $message
```

**Result**: The child gets merged style: `"p-2 border bg-red-100"`

### Style Merging Examples

#### Basic Style Merging
```yaml
baseButton:
  from: button
  style: "px-4 py-2 $colors"  # Base styles + variable colors
  body: "$text"

primaryButton:
  from: baseButton
  colors: "bg-blue-500 text-white"
  text: "Primary"

secondaryButton:
  from: baseButton
  colors: "bg-gray-200 text-gray-800"
  text: "Secondary"
```

#### Complex Style Merging
```yaml
card:
  from: div
  style: "border rounded $shadow $colors p-4"
  body: "$content"

elevatedCard:
  from: card
  shadow: "shadow-lg"
  colors: "bg-white"
  content: "Elevated card"

flatCard:
  from: card
  shadow: "shadow-sm"
  colors: "bg-gray-50"
  content: "Flat card"
```

### Body Merging with Variables

```yaml
section:
  from: section
  body:
    - from: h2
      style: "text-xl font-bold"
      body: "$title"
    - "$content"  # Variable for additional content

aboutSection:
  from: section
  title: "About Us"
  content: "This is the about content"

contactSection:
  from: section
  title: "Contact"
  content: "Get in touch with us"
```

### Multiple Variable Merging

```yaml
flexContainer:
  from: div
  style: "flex $direction $justify $align $gap"
  body: "$children"

rowCenter:
  from: flexContainer
  direction: "row"
  justify: "center"
  align: "items-center"
  gap: "gap-4"
  children: "Row content"

columnStart:
  from: flexContainer
  direction: "col"
  justify: "start"
  align: "items-stretch"
  gap: "gap-2"
  children: "Column content"
```

### Inheritance Chain with Variable Merging

```yaml
baseBox:
  from: div
  style: "p-2 $border $background"
  body: "$content"

borderedBox:
  from: baseBox
  border: "border-2 border-gray-300"
  # Inherits background and content from parent

coloredBorderedBox:
  from: borderedBox
  background: "bg-blue-100"
  content: "Colored bordered box"
```

**Result**: `style: "p-2 border-2 border-gray-300 bg-blue-100"`

### Deep Inheritance Chain

```yaml
level1:
  from: div
  style: "p-2"
  body: "$text"

level2:
  from: level1
  text: "$content"

level3:
  from: level2
  content: "Final message"
```

Each level can define variables that the previous level uses.

### Key Principles for Variable-Based Merging:

1. **Parent Design**: Parents must explicitly use `$variable` syntax in properties they want to allow merging
2. **Child Responsibility**: Children provide values for these variables
3. **Complete Replacement**: If a child doesn't provide a variable value, it becomes an empty string
4. **Multiple Variables**: Parents can use multiple variables for fine-grained control
5. **Any Property**: Any property (style, body, attributes) can use variable merging

## Templates

Templates use `$` prefix and provide default structure. **Important**: Templates must have the same name as the component, prefixed with `$`. For example, if for a `box` component its template should be named `$box`.

### Basic Template

```yaml
$myCard:
  from: div
  style: "border p-4 shadow"
  body: "$content"

myCard:
  content: "This uses the template"
```

### Template with Body Structure

```yaml
$myList:
  from: ul
  style: "list-disc"
  body:
    - from: li
      body: "$item1"
    - from: li
      body: "$item2"

myList:
  item1: "First item"
  item2: "Second item"
```

### Template with Array Body

```yaml
$experienceRow:
  from: div
  style: "flex justify-between"
  body: ["$left", "$right"]

experienceRow:
  left: "Company Name"
  right: "2020-2023"
```

### Template with List Children

```yaml
$experience:
  from: div
  style: "flex justify-between"
  body:
    - $prop1
    - $prop2

experience:
  - prop1: CompanyA
    prop2: 2024-2025
  - prop1: CompanyB
    prop2: 2023-2024
```

## Arrays and Lists

### Array of Components

```yaml
menu:
  from: nav
  body:
    - from: button
      body: "Home"
    - from: button
      body: "About"
    - from: button
      body: "Contact"
```

### Mixed Content Arrays

```yaml
content:
  from: div
  body:
    - from: h2
      body: "Title"
    - "Some text content"
    - from: p
      body: "Paragraph content"
```

### Array with Component References

```yaml
buttons:
  body:
    - primaryButton
    - secondaryButton

primaryButton:
  from: button
  style: "bg-blue-500 text-white"
  body: "Primary"

secondaryButton:
  from: button
  style: "bg-gray-200"
  body: "Secondary"
```

## Advanced Features

### Shortcut Syntax

For simple components, use shortcut syntax:

```yaml
# Instead of:
# item:
#   from: li
#   body: "content"

item: li: content

# With style:
item:
  li: content
  style: "text-red-500"
```

### Implicit Body

When body is a string, you can use implicit syntax:

```yaml
# Instead of:
# title:
#   from: h1
#   body: "Title"

title: h1: Title
```

### Component Lists

```yaml
document:
  - header
  - content
  - footer

header:
  from: header
  body: "Site Header"

content:
  from: main
  body: "Main content"

footer:
  from: footer
  body: "Site Footer"
```

### Dynamic Component Lists

```yaml
experiences:
  - company: "Company A"
    date: "2020-2023"
    position: "Developer"
  - company: "Company B"
    date: "2023-Present"
    position: "Senior Developer"

$experience:
  from: div
  style: "border-b p-2"
  body:
    - from: h3
      body: "$company"
    - from: p
      body: "$position ($date)"
```

### Optional Props

```yaml
flexBox:
  from: div
  style: "flex $direction $justify"

# Usage with optional props:
flexBox({ direction: "col", justify: "center" })
# Missing props become empty strings
```

### Component Reference in Body Array

```yaml
box:
  from: div
  id: parent
  body:
    - div: first child
    - div: second child
    - p: third child
    - h2: fourth child
```

### Component Reference with Properties

```yaml
box:
  - div:
      body: unique child
      style: text-red-500
```

### Component Reference with Implicit Body

```yaml
box:
  - div: unique child
    style: text-red-500
```

## Built-in HTML Tags

The system supports these HTML tags directly:

- **Text**: `p`, `span`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Layout**: `div`, `section`, `header`, `footer`, `main`, `nav`
- **Lists**: `ul`, `ol`, `li`
- **Tables**: `table`, `thead`, `tbody`, `tr`, `td`, `th`
- **Forms**: `form`, `input`, `label`, `button`
- **Media**: `img`
- **Other**: `a`, `br`, `pre`

### Example with Various Tags

```yaml
article:
  from: article
  body:
    - h1: "Article Title"
    - p: "Article introduction"
    - ul:
        - li: "Point 1"
        - li: "Point 2"
    - a:
        href: "#"
        body: "Read more"
```

## Complete Example: CV Section

Here's a complete example showing many features:

```yaml
# Template for experience entries
$experience:
  from: div
  style: "mb-4 p-3 border-l-4 border-blue-500"
  body:
    - from: div
      style: "flex justify-between items-start"
      body:
        - from: h3
          style: "font-bold text-lg"
          body: "$position"
        - from: span
          style: "text-gray-600 text-sm"
          body: "$date"
    - from: h4
      style: "text-blue-600 font-medium"
      body: "$company"
    - from: p
      style: "text-gray-700 mt-2"
      body: "$description"

# Experience section
experienceSection:
  from: section
  body:
    - from: h2
      style: "text-2xl font-bold mb-4 uppercase tracking-wider"
      body: "Experience"
    - experiences

# Experience data
experiences:
  - company: "Tech Corp"
    date: "2020-Present"
    position: "Senior Developer"
    description: "Leading development of enterprise applications"
  - company: "StartupXYZ"
    date: "2018-2020"
    position: "Full Stack Developer"
    description: "Built web applications from scratch"
```

This system provides a powerful, flexible way to create complex UI components using simple YAML syntax, with support for inheritance, templating, and dynamic content generation.

## Accessing Documentation in Code

You can fetch documentation content programmatically using the built-in documentation system:

### Using the useDocumentation Hook

```typescript
import { useDocumentation } from '../hooks/useDocumentation';

const MyComponent = () => {
  const { content, loading, error } = useDocumentation('yaml-component-system.md');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <MonacoEditor
      height="100%"
      language="markdown"
      theme="vs-light"
      value={content}
      options={{ readOnly: true }}
    />
  );
};
```

### Available Documentation Files

- `yaml-component-system.md` - Complete YAML component system documentation
- Additional docs can be added to the `docs/` folder

### Keyboard Shortcuts

- `Ctrl+D` - Toggle documentation viewer in the editor panel