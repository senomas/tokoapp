# README

## init

```
npm init vite@latest
> project name: <project>
> framework: svelte
> variant: svelte-js
	  
npm i
npm run dev -- --host 192.168.1.101
```

## init tailwindcss

```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
	  
npx tailwindcss init -p
	  
mv tailwind.config.js tailwind.config.cjs
```

### edit tailwind.config.cjs

```
module.exports = {
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {}
  },
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  variants: {
    extend: {}
  }
};
```

### edit postcss.config.js

```
import tailwind from 'tailwindcss';
import tailwindConfig from './tailwind.config.cjs';
import autoprefixer from 'autoprefixer';
		  
export default {
  plugins: [tailwind(tailwindConfig), autoprefixer]
};
```

### edit vite.config.js

```
import postcss from './postcss.config.js';
// eslint-disable-next-line import/namespace
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
		  
// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [svelte()],
  css:{
    postcss
  }
})
```

### add src/app.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
		  
@layer components {
  .btn-primary {
    @apply text-white bg-blue-700 rounded-lg w-full px-5 text-center hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto;
  }
  .btn-cancel {
    @apply text-white bg-blue-700 rounded-lg w-full px-5 text-center hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto;
  }
}
```

### css usage on .svelte

```
<script lang="ts">
  import './app.css';
		  
```

## add prettier

```
npm i eslint eslint-plugin-import eslint-plugin-svelte3 prettier prettier-plugin-svelte
```

### add .eslintrc.json

```
{
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/recommended"
  ],
  "overrides": [
    {
      "files": [
        "**/*.svelte"
      ],
      "processor": "svelte3/svelte3"
    }
  ],
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "svelte3"
  ]
}
```

### add .prettierrc

```
{
  "arrowParens": "avoid",
  "bracketSpacing": false,
  "singleQuote": true,
  "svelteSortOrder": "options-scripts-markup-styles",
  "trailingComma": "none"
}
```

### add .prettierignore

```
public/build
dist
```

### add package.json scripts

```
"format": "prettier --write '{public,src}/**/*.{css,html,js,ts,svelte}'",
"lint": "eslint --fix --quiet src --ext .js,.ts,.svelte",
```

## vscode plugins

- Name: ESLint
  Id: dbaeumer.vscode-eslint
  Description: Integrates ESLint JavaScript into VS Code.
  Version: 2.2.2
  Publisher: Microsoft
  VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
  Name: Prettier - Code formatter
- Id: esbenp.prettier-vscode
  Description: Code formatter using prettier
  Version: 9.2.0
  Publisher: Prettier
  VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
  Name: Svelte for VS Code
- Id: svelte.svelte-vscode
  Description: Svelte language support for VS Code
  Version: 105.12.1
  Publisher: Svelte
  VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode
  Name: Tailwind CSS IntelliSense
- Id: bradlc.vscode-tailwindcss
  Description: Intelligent Tailwind CSS tooling for VS Code
  Version: 0.7.7
  Publisher: Tailwind Labs
  VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
  Name: PostCSS Language Support
- Id: csstools.postcss
  Description: Syntax highlighting for modern and experimental CSS in VSCode
  Version: 1.0.9
  Publisher: csstools
  VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=csstools.postcss
