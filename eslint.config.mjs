// rules from eslint

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        ignores: [
            'dist',
            'node_modules',
            'eslint.config.mjs',
            'jest.config.js',
            'app.spec.ts',
            '**/*.spec.ts',
            'tests',
            'scripts/generateKeys.mjs',
            'scripts/convertPemToJwk.mjs',
            'src/migration/1736524240857-migration.ts',
            "coverage", 
            "node_modules",
            "dist"
        ],
    },
    
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-console': 'off',
            'dot-notation': 'off',
        },
    },
)