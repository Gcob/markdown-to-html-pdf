#!/usr/bin/env node

import { parseArgs } from './lib/cli.mjs';
import { convertMarkdownToHtml } from './lib/converter.mjs';
import { convertHtmlToPdf } from './lib/pdf-converter.mjs';
import path from 'path';
import fs from 'fs/promises';

async function main() {
    try {
        const args = parseArgs();
        let htmlFile = args.inputFile;
        let outputPdfFile;

        // Determine if the input is a Markdown file
        if (args.inputFile.toLowerCase().endsWith('.md')) {
            // Convert Markdown to HTML first
            const options = { ...args, noOpen: true }; // Ensure no browser is opened
            htmlFile = await convertMarkdownToHtml(args.inputFile, options);
            console.log(`Markdown converted to HTML: ${htmlFile}`);
        } else if (!args.inputFile.toLowerCase().endsWith('.html')) {
            throw new Error('Input file must be either Markdown (.md) or HTML (.html)');
        }

        // Define output PDF file path
        if (args.output) {
            outputPdfFile = args.output;
        } else {
            const parsedPath = path.parse(args.inputFile);
            // Create the 'out' directory if it doesn't exist
            const outDir = path.join(process.cwd(), 'out');
            try {
                await fs.mkdir(outDir, { recursive: true });
            } catch (error) {
                if (error.code !== 'EEXIST') {
                    throw error;
                }
            }
            outputPdfFile = path.join(outDir, `${parsedPath.name}.pdf`);
        }

        // Convert HTML to PDF
        const pdfFile = await convertHtmlToPdf(htmlFile, { outputFile: outputPdfFile });
        console.log(`Conversion successful! PDF file generated: ${pdfFile}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();