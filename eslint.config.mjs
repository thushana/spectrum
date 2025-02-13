import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// ESM setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat to handle legacy ESLint extensions
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extends
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended', // Ensures Prettier and ESLint work together
  ),

  // Rules
  {
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'no-console': 'warn', // Warn about console.log usage
      quotes: ['error', 'single'], // Align ESLint to single quotes
      semi: ['error', 'always'], // Enforce semicolons
      indent: ['error', 2], // Enforce 2-space indentation
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Prettier: enforce single quotes to align with ESLint
          semi: true, // Prettier: enforce semicolons to align with ESLint
        },
      ],
    },
  },
];
