const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const boundariesPlugin = require('eslint-plugin-boundaries');

module.exports = [
    js.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx,d.ts}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                HTMLElement: 'readonly',
                HTMLInputElement: 'readonly',
                File: 'readonly',
                FormData: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                HTMLLinkElement: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            boundaries: boundariesPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
            'boundaries/elements': [
                {
                    type: 'app',
                    pattern: 'src/renderer/app/**',
                },
                {
                    type: 'pages',
                    pattern: 'src/renderer/pages/**',
                    capture: ['page'],
                },
                {
                    type: 'widgets',
                    pattern: 'src/renderer/widgets/**',
                    capture: ['widget'],
                },
                {
                    type: 'features',
                    pattern: 'src/renderer/features/**',
                    capture: ['feature'],
                },
                {
                    type: 'entities',
                    pattern: 'src/renderer/entities/**',
                    capture: ['entity'],
                },
                {
                    type: 'shared',
                    pattern: 'src/renderer/shared/**',
                },
            ],
            'boundaries/ignore': [
                '**/*.test.*',
                '**/*.spec.*',
                '**/*.stories.*',
                '**/*.d.ts',
                // 忽略非 FSD 架構的路徑
                '**/assets/**',
                '**/public/**',
            ],
            'boundaries/include': ['src/renderer/**']
        },
        rules: {
            // TypeScript 推薦規則
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',

            // Feature-Sliced Design 架構規則
            'boundaries/element-types': [
                'error',
                {
                    default: 'disallow',
                    rules: [
                        // app 可以使用所有層級
                        {
                            from: ['app'],
                            allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
                        },
                        // pages 可以使用 widgets, features, entities, shared
                        {
                            from: ['pages'],
                            allow: ['widgets', 'features', 'entities', 'shared'],
                        },
                        // widgets 可以使用 features, entities, shared
                        {
                            from: ['widgets'],
                            allow: ['features', 'entities', 'shared'],
                        },
                        // features 可以使用 entities, shared
                        {
                            from: ['features'],
                            allow: ['entities', 'shared'],
                        },
                        // entities 只能使用 shared（允許 entities 之間互相依賴）
                        {
                            from: ['entities'],
                            allow: ['entities', 'shared'],
                        },
                        // shared 不能依賴其他層級（只能內部依賴）
                        {
                            from: ['shared'],
                            allow: ['shared'],
                        },
                    ],
                },
            ],

            // 防止未知檔案類型（只對 renderer 層生效）
            'boundaries/no-unknown': 'error',
            'boundaries/no-unknown-files': 'error',
        },
    },
    {
        // Main process 和 preload 檔案的配置
        files: ['src/main/**/*.{ts,tsx}', 'src/preload/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                window: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
        },
    },
    {
        // 忽略 d.ts 檔案
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
