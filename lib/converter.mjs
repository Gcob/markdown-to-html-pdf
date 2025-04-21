import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { getThemeCSS } from './themes/index.mjs';
import open from 'open';
import hljs from 'highlight.js';

// Configuration of marked to use highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
});

export async function convertMarkdownToHtml(inputFile, options) {
    try {
        // Read the markdown file
        const markdownContent = await fs.readFile(inputFile, 'utf-8');

        // Convert to HTML
        const htmlContent = marked(markdownContent);

        // Get CSS for the theme
        const themeCSS = await getThemeCSS(options.theme);

        // Create the complete HTML document
        const fullHtml = createHtmlDocument(htmlContent, themeCSS, path.basename(inputFile, '.md'));

        // Write the HTML file
        await fs.writeFile(options.outputFile, fullHtml);

        // Open the file in the browser if requested
        if (!options.noOpen) {
            await open(options.outputFile);
        }

        return options.outputFile;
    } catch (error) {
        throw new Error(`Error during conversion: ${error.message}`);
    }
}

function createHtmlDocument(htmlContent, css, title) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
  </div>
</body>
</html>`;
}