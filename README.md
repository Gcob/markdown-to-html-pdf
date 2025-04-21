# Markdown to HTML/PDF Converter

Convert Markdown files to HTML with different themes and export to PDF.

## Demo

Check out the `demo` folder for example Markdown files and usage examples.

## Installation

This project uses pnpm for faster, disk-space efficient dependency management.

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
git clone git@github.com:Gcob/markdown-to-html-pdf.git
cd markdown-to-html-pdf
pnpm install
```

For global installation (optional): `pnpm install -g .`

## Usage

### HTML Conversion

Basic: `node tohtml.mjs document.md`

With theme: `node tohtml.mjs document.md -t dark`

List themes: `node tohtml.mjs --list-themes`

Specify output: `node tohtml.mjs document.md -o output.html`

Don't open in browser: `node tohtml.mjs document.md --no-open`

Disable unbreakable sections: `node tohtml.mjs document.md --no-unbreakable-sections`

Help: `node tohtml.mjs --help`

### PDF Conversion

Convert HTML to PDF: `node topdf.mjs document.html`

Convert Markdown to PDF: `node topdf.mjs document.md`

Specify output: `node topdf.mjs document.md -o output.pdf`

Use a specific theme: `node topdf.mjs document.md -t dark`

Disable unbreakable sections: `node topdf.mjs document.md --no-unbreakable-sections`

Help: `node topdf.mjs --help`

## Available Themes

- **light** - Default light theme
- **dark** - Dark theme
- **blog** - Blog layout theme
- **government** - Formal government document theme

## Custom Themes

Add your SCSS file to `lib/themes/` and update `getAvailableThemes()` in `lib/themes/index.mjs`.

## Print Layout Features

- **Unbreakable Sections**: By default, content between headings is wrapped in "unbreakable" sections for better printing. This prevents awkward page breaks in the middle of content sections.
  - Headings (h1, h2) will start on new pages, but the first heading won't cause a blank page
  - Content sections will be kept together when possible
  - You can disable this feature with the `--no-unbreakable-sections` flag

## License

MIT - See [LICENSE](LICENSE) for details.

## Disclaimer

This project was created and maintained mostly by Claude Code, an AI assistant by Anthropic.
