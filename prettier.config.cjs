// @ts-check

/** @type {import('prettier').Config} */
module.exports = {
    plugins: [require.resolve("@ianvs/prettier-plugin-sort-imports"),require("prettier-plugin-tailwindcss"),require('prettier-plugin-astro')],
    tailwindConfig: './tailwind.config.js',
    tailwindAttributes: ["class"],
    singleQuote: true,
    semi: true,
    importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
    importOrderParserPlugins: ['typescript'],
    importOrderTypeScriptVersion: '5.0.0',
    overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
