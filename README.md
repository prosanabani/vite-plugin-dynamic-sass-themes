# vite-plugin-dynamic-sass-themes

A Vite plugin for dynamically compiling and applying SASS themes in your Vite project. This plugin allows you to manage multiple SASS themes, compile them on-the-fly, and dynamically update the styles in the browser without a full page reload.

---

## Features

- **Dynamic Theme Compilation**: Automatically compiles SASS themes from a specified directory.
- **Hot Module Replacement (HMR)**: Updates styles in the browser without reloading the page.
- **Customizable Options**: Configure themes directory, output directory, logging, and SASS options.
- **TypeScript Support**: Includes TypeScript declarations for the virtual module.

---

## Installation

Install the plugin using npm, pnpm, or yarn:

```bash
# npm
npm install vite-plugin-dynamic-sass-themes --save-dev

# pnpm
pnpm add vite-plugin-dynamic-sass-themes --save-dev

# yarn
yarn add vite-plugin-dynamic-sass-themes --dev

```

---

## Usage

### 1. Add the Plugin to `vite.config.ts`

Configure the plugin in your `vite.config.ts` file:

```typescript
import { defineConfig } from "vite";
import dynamicSassThemePlugin from "vite-plugin-dynamic-sass-themes";

export default defineConfig({
  plugins: [
    dynamicSassThemePlugin({
      themesDir: "src/themes", // Relative path to themes directory
      outputDir: "public/themes", // Relative path to output directory
      log: true, // Enable logging
      sassOptions: {
        style: "compressed", // Minify CSS output
        sourceMap: true, // Generate source maps
      },
    }),
  ],
});
```

---

### 2. Import the Client-Side Code

In your main entry file (e.g., main.ts or main.js), import the client-side code:

```typescript
import "virtual:dynamic-sass-themes-client";
```

---

### 3. Declare the Virtual Module in `vite-env.d.ts`

If you don’t already have a `vite-env.d.ts` file, create one in the root of your project. Then, add the following declaration for the virtual module:

```typescript
/// <reference types="vite/client" />

// Declare the virtual module
declare module "virtual:dynamic-sass-themes-client" {
  const clientCode: string;
  export default clientCode;
}
```

---

### 4. Ensure `vite-env.d.ts` is Included in `tsconfig.json`

Make sure your `tsconfig.json` includes the `vite-env.d.ts` file:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src", "vite-env.d.ts"]
}
```

---

## Example Project Structure

Here’s how your project structure should look:

```
my-project/
├── src/
│   ├── main.ts
│   └── themes/
│       ├── light/
│       │   └── theme.scss
│       └── dark/
│           └── theme.scss
├── vite-env.d.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
└── ...
```

---

## How It Works

### Plugin Side

- The plugin watches for changes to `.scss` files in the `themesDir`.
- When a `.scss` file changes, it compiles the file and sends the compiled CSS to the client via a custom HMR event (`vite-plugin-dynamic-sass-themes:update`).

### Client Side

- The client-side code is injected as a virtual module (`virtual:dynamic-sass-themes-client`).
- When the HMR event is received, the client-side code dynamically updates the `<style>` element with the new CSS.

---

## Testing

1. Add the declaration to `vite-env.d.ts` in your project.
2. Ensure `vite-env.d.ts` is included in `tsconfig.json`.
3. Run your Vite development server.
4. Modify a `.scss` file in your `themesDir`.
5. Observe that the browser updates the styles dynamically without reloading the page, and TypeScript no longer throws an error.

---

## Options

The plugin accepts the following options:

| Option        | Type    | Default           | Description                                           |
| ------------- | ------- | ----------------- | ----------------------------------------------------- |
| `themesDir`   | string  | `"src/themes"`    | Directory containing theme SASS files.                |
| `outputDir`   | string  | `"public/themes"` | Output directory for compiled CSS.                    |
| `log`         | boolean | `true`            | Enable/disable logging.                               |
| `sassOptions` | object  | `{}`              | Additional SASS options (e.g., `style`, `sourceMap`). |

---

## Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy theming! 🎨
