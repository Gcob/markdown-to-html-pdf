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

/**
 * Wraps content between headings in unbreakable sections for better printing
 * @param {string} html - The HTML content to process
 * @returns {string} - The HTML content with sections wrapped
 */
function wrapContentInUnbreakableSections(html) {
    // Regular expression to find all heading tags (h1 through h6)
    const headingRegex = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g;
    
    // Split the HTML at heading tags
    const parts = html.split(headingRegex);
    
    if (parts.length <= 1) {
        // No headings found, wrap everything
        return `<div class="print-section">${html}</div>`;
    }
    
    let result = '';
    let currentSection = '';
    
    // Process the parts
    for (let i = 0; i < parts.length; i++) {
        if (i % 4 === 0) {
            // Text before a heading or between headings and content
            currentSection += parts[i];
        } else if (i % 4 === 1) {
            // Heading level (1-6)
            const level = parts[i];
            const attributes = parts[i+1] || '';
            const content = parts[i+2] || '';
            
            // If there's content in the current section, wrap it
            if (currentSection.trim()) {
                result += `<div class="print-section">${currentSection}</div>`;
                currentSection = '';
            }
            
            // Start a new section with the heading
            currentSection = `<h${level}${attributes}>${content}</h${level}>`;
            
            // Skip the next two parts as we already processed them
            i += 2;
        }
    }
    
    // Add the last section if there's content
    if (currentSection.trim()) {
        result += `<div class="print-section">${currentSection}</div>`;
    }
    
    return result;
}

export async function convertMarkdownToHtml(inputFile, options) {
    try {
        // Read the markdown file
        const markdownContent = await fs.readFile(inputFile, 'utf-8');

        // Convert to HTML
        let htmlContent = marked(markdownContent);

        // Wrap content between headings in unbreakable sections for printing
        if (options.unbreakableSections !== false) {
            htmlContent = wrapContentInUnbreakableSections(htmlContent);
        }

        // Get CSS for the theme
        const themeCSS = await getThemeCSS(options.theme);

        // Create the complete HTML document
        const fileName = path.basename(inputFile, '.md');
        let finalHtmlContent = htmlContent;
        
        // Add filename as H1 title if option is enabled
        if (options.useFilenameAsTitle) {
            const titleHtml = `<h1>${fileName}</h1>`;
            finalHtmlContent = options.unbreakableSections !== false 
                ? `<div class="print-section">${titleHtml}</div>\n${htmlContent}`
                : `${titleHtml}\n${htmlContent}`;
        }
        
        const fullHtml = createHtmlDocument(finalHtmlContent, themeCSS, fileName, options.fontSize);

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

function createHtmlDocument(htmlContent, css, title, fontSize = 12) {
    return `<!DOCTYPE html>
<html lang="en" style="font-size: ${fontSize}px;">
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