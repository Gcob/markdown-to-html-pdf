import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import { getAvailableThemes } from './themes/index.mjs';

export function parseArgs() {
    const availableThemes = getAvailableThemes();

    const argv = yargs(hideBin(process.argv))
        .usage('Usage: $0 [options] <input.md>')
        .example('$0 document.md', 'Converts document.md to HTML with the default theme (light)')
        .example('$0 document.md -t dark', 'Converts document.md with the dark theme')
        .example('$0 --list-themes', 'Displays a list of available themes')

        .option('t', {
            alias: 'theme',
            describe: 'Theme to use',
            type: 'string',
            default: 'light',
            choices: availableThemes
        })

        .option('o', {
            alias: 'output',
            describe: 'Output filename',
            type: 'string'
        })

        .option('list-themes', {
            describe: 'Display the list of available themes',
            type: 'boolean'
        })

        .option('no-open', {
            describe: 'Do not automatically open the generated file with the default application',
            type: 'boolean',
            default: false
        })
        
        .option('use-title', {
            alias: 'use-filename-as-title',
            describe: 'Use the filename as the title (H1) in the output',
            type: 'boolean',
            default: true
        })
        
        .option('font-size', {
            describe: 'Base font size in pixels',
            type: 'number',
            default: 12
        })
        
        .option('unbreakable-sections', {
            describe: 'Wrap content between headings into unbreakable sections for printing',
            type: 'boolean',
            default: true
        })

        .help('h')
        .alias('h', 'help')
        .epilog('Markdown to HTML converter with themes')
        .argv;

    // Display the list of themes if requested
    if (argv.listThemes) {
        console.log('Available themes:');
        availableThemes.forEach(theme => console.log(`- ${theme}`));
        process.exit(0);
    }

    // Check if there is an input file (non-option argument)
    const inputFile = argv._[0];

    if (!inputFile) {
        console.error('Please specify a Markdown file to convert');
        yargs().showHelp();
        process.exit(1);
    }

    // Check if the file exists
    if (!fs.existsSync(inputFile)) {
        throw new Error(`The file ${inputFile} does not exist`);
    }

    // Determine the output filename
    let outputFile = argv.output;
    if (!outputFile) {
        const parsedPath = path.parse(inputFile);
        // Create the 'out' directory if it doesn't exist
        const outDir = path.join(process.cwd(), 'out');
        try {
            fs.mkdirSync(outDir, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
        outputFile = path.join(outDir, `${parsedPath.name}.html`);
    }

    return {
        inputFile,
        outputFile,
        theme: argv.theme,
        noOpen: argv.noOpen,
        useFilenameAsTitle: argv.useTitle !== false, // default to true
        fontSize: argv.fontSize || 12, // default to 12px
        unbreakableSections: argv.unbreakableSections !== false // default to true
    };
}