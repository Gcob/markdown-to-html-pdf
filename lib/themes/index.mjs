import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fonction pour obtenir la liste des thèmes disponibles
export function getAvailableThemes() {
    // On lit les fichiers .scss pour identifier les thèmes
    const themeFiles = [
        'dark',
        'light',
        'blog',
        'government'
    ];

    return themeFiles;
}

// Fonction pour compiler le SCSS en CSS
export async function getThemeCSS(themeName) {
    try {
        const themePath = path.join(__dirname, `${themeName}.scss`);

        // Vérifier si le thème existe
        try {
            await fs.access(themePath);
        } catch (error) {
            throw new Error(`Theme '${themeName}' does not exist`);
        }

        // Lire le fichier SCSS
        const scssContent = await fs.readFile(themePath, 'utf-8');

        // Compiler le SCSS en CSS
        const result = sass.compileString(scssContent);
        return result.css;
    } catch (error) {
        throw new Error(`Error loading theme ${themeName}: ${error.message}`);
    }
}