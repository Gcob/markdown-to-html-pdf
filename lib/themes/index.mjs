import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getAvailableThemes() {
    const themeFiles = [
        'dark',
        'light',
        'blog',
        'government'
    ];

    return themeFiles;
}

export async function getThemeCSS(themeName) {
    try {
        const themePath = path.join(__dirname, `${themeName}.scss`);

        try {
            await fs.access(themePath);
        } catch (error) {
            throw new Error(`Theme '${themeName}' does not exist`);
        }

        const scssContent = await fs.readFile(themePath, 'utf-8');
        const result = sass.compileString(scssContent);
        return result.css;
    } catch (error) {
        throw new Error(`Error loading theme ${themeName}: ${error.message}`);
    }
}