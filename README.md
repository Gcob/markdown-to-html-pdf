# Markdown to HTML Converter

Ce projet permet de convertir des fichiers Markdown en pages HTML avec différents thèmes.

## Installation

1. Clonez ce dépôt :
   ```
   git clone <url-du-repo>
   cd markdown-to-html
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Pour une installation globale (optionnel) :
   ```
   npm install -g .
   ```

## Utilisation

### Utilisation de base

```bash
node tohtml.mjs document.md
```

Cela convertira `document.md` en HTML en utilisant le thème par défaut (light) et ouvrira le fichier HTML généré dans votre navigateur par défaut.

### Spécifier un thème

```bash
node tohtml.mjs document.md -t dark
# ou
node tohtml.mjs document.md --theme dark
```

### Liste des thèmes disponibles

```bash
node tohtml.mjs --list-themes
```

### Spécifier un fichier de sortie

```bash
node tohtml.mjs document.md -o resultat.html
```

### Ne pas ouvrir le fichier dans le navigateur

```bash
node tohtml.mjs document.md --no-open
```

### Aide

```bash
node tohtml.mjs --help
```

## Thèmes disponibles

1. **light** - Thème clair conventionnel (par défaut)
2. **dark** - Thème sombre conventionnel
3. **blog** - Thème de type blog avec une mise en page adaptée
4. **government** - Thème formel de document gouvernemental

## Création de thèmes personnalisés

Pour créer votre propre thème :

1. Ajoutez un fichier SCSS dans le dossier `lib/themes/`, par exemple `mon-theme.scss`
2. Mettez à jour la fonction `getAvailableThemes()` dans `lib/themes/index.mjs` pour inclure votre nouveau thème

## Licence

MIT