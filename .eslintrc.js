module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    // 'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint', 'react-hooks'],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: { version: 'detect' },
    },
    env: {
        browser: true,
        node: true,
        jasmine: true,
    },
    rules: {
        // indent: ['error', 4, { SwitchCase: 1 }], // Indent with 4 spaces
        '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }], // Indent with 4 spaces
        'react/jsx-indent': ['error', 4], // Indent JSX with 4 spaces
        'react/jsx-indent-props': ['error', 4], // Indent props with 4 spaces

        'global-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'no-plusplus': 'off',
        'max-len': [1, 120, 2],
        // { ignoreComments: true, ignoreRegExpLiteral: true, ignoreUrls: true, }],
        'object-curly-newline': 'off',
        'no-console': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-filename-extension': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'jsx-a11y/anchor-is-valid': [
            'error',
            {
                components: ['Link'],
                specialLink: ['hrefLeft', 'hrefRight'],
                aspects: ['invalidHref', 'preferButton'],
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 'off',
        'react/forbid-prop-types': 'off',
        'react/no-unused-prop-types': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
    },
};
