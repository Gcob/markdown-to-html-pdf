#!/usr/bin/env node

import { parseArgs } from './lib/cli.mjs';
import { convertMarkdownToHtml } from './lib/converter.mjs';

async function main() {
    try {
        const args = parseArgs();

        if (args.inputFile) {
            const htmlFile = await convertMarkdownToHtml(args.inputFile, args);
            console.log(`Conversion successful! HTML file generated: ${htmlFile}${args.noOpen ? '' : ' and opened in your browser'}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();