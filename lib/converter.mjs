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
    // Check if tailwind theme is used by looking for the tailwind URL in the CSS
    const isTailwind = css.includes('--tailwind-url');
    const tailwindUrl = isTailwind ? 'https://cdn.tailwindcss.com' : '';
    
    // Determine body and container classes based on the theme
    const bodyClass = isTailwind ? 'bg-white text-gray-800 font-sans leading-relaxed' : '';
    const containerClass = isTailwind ? 'container max-w-4xl mx-auto px-4 py-8' : 'container';
    
    return `<!DOCTYPE html>
<html lang="en" style="font-size: ${fontSize}px;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${isTailwind ? `<script src="${tailwindUrl}"></script>` : ''}
  <style>
${css}
  </style>
  <!-- Google Fonts CDN -->
  ${isTailwind ? `
  <script>
    // Apply Tailwind classes to elements after the page loads
    window.addEventListener('DOMContentLoaded', (event) => {
      // Add Tailwind classes to headings
      document.querySelectorAll('h1').forEach(el => {
        el.classList.add('text-3xl', 'font-bold', 'mb-4', 'text-gray-900', 'pb-2');
      });
      document.querySelectorAll('h2').forEach(el => {
        el.classList.add('text-2xl', 'font-bold', 'mb-3', 'text-gray-800', 'pb-1');
      });
      document.querySelectorAll('h3').forEach(el => {
        el.classList.add('text-xl', 'font-semibold', 'mb-2', 'text-gray-800');
      });
      document.querySelectorAll('h4').forEach(el => {
        el.classList.add('text-lg', 'font-semibold', 'mb-2', 'text-gray-800');
      });
      
      // Add Tailwind classes to paragraphs
      document.querySelectorAll('p').forEach(el => {
        el.classList.add('mb-4', 'leading-relaxed');
      });
      
      // Add Tailwind classes to links
      document.querySelectorAll('a').forEach(el => {
        el.classList.add('text-blue-600', 'hover:text-blue-800', 'underline');
      });
      
      // Add Tailwind classes to lists
      document.querySelectorAll('ul').forEach(el => {
        el.classList.add('mb-4', 'pl-5', 'list-disc');
      });
      document.querySelectorAll('ol').forEach(el => {
        el.classList.add('mb-4', 'pl-5', 'list-decimal');
      });
      document.querySelectorAll('li').forEach(el => {
        el.classList.add('mb-1');
      });
      
      // Add Tailwind classes to blockquotes
      document.querySelectorAll('blockquote').forEach(el => {
        el.classList.add('pl-4', 'border-l-4', 'border-gray-300', 'italic', 'my-4', 'text-gray-600');
      });
      
      // Add Tailwind classes to code blocks
      document.querySelectorAll('code').forEach(el => {
        el.classList.add('font-mono', 'bg-gray-100', 'p-1', 'rounded', 'text-sm');
      });
      document.querySelectorAll('pre').forEach(el => {
        el.classList.add('bg-gray-100', 'p-4', 'rounded', 'my-4', 'overflow-x-auto');
      });
      document.querySelectorAll('pre code').forEach(el => {
        el.classList.remove('bg-gray-100', 'p-1');
      });
      
      // Add Tailwind classes to tables
      document.querySelectorAll('table').forEach(el => {
        el.classList.add('w-full', 'border-collapse', 'my-4');
      });
      document.querySelectorAll('th, td').forEach(el => {
        el.classList.add('border', 'border-gray-300', 'p-2', 'text-left');
      });
      document.querySelectorAll('th').forEach(el => {
        el.classList.add('bg-gray-100', 'font-semibold');
      });
      
      // Add Tailwind classes to images
      document.querySelectorAll('img').forEach(el => {
        el.classList.add('max-w-full', 'h-auto', 'my-4', 'rounded');
      });
    });
  </script>
  ` : ''}
</head>
<body class="${bodyClass}">
  <div class="${containerClass}">
    ${htmlContent}
  </div>
</body>
</html>`;
}