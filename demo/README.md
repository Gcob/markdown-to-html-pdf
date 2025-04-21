# Demo Examples

This folder contains example Markdown files to demonstrate the Markdown to HTML converter.

## Files

- `example1.md` - Basic Markdown formatting examples (headings, lists, code blocks, etc.)
- `example2.md` - More advanced Markdown with tables, ASCII diagrams, and image references

## Usage

Convert examples using different themes:

```bash
# Convert with light theme (default)
node ../tohtml.mjs example1.md

# Convert with dark theme
node ../tohtml.mjs example1.md -t dark

# Convert with blog theme
node ../tohtml.mjs example2.md -t blog

# Convert with government theme
node ../tohtml.mjs example2.md -t government
```

Try converting the same file with different themes to see how the styling changes.