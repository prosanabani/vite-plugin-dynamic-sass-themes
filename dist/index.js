import fs from "fs";
import path from "path";
import { compile } from "sass";
/**
 * A Vite plugin to dynamically compile and inject SASS themes.
 * @param {DynamicSassThemePluginOptions} options - Configuration options for the plugin.
 * @returns {Plugin} - A Vite plugin instance.
 */
export default function dynamicSassThemePlugin(options = {}) {
    const { themesDir = "src/themes", // Default themes directory
    outputDir = "public/themes", // Default output directory
    log = true, // Enable/disable logging
    sassOptions = {}, // Additional SASS options
     } = options;
    // Helper function to compile and save a theme
    const compileAndSaveTheme = (themeScssPath, outputCssPath) => {
        try {
            // Compile the SASS file into CSS
            const result = compile(themeScssPath, sassOptions);
            // Ensure the output directory exists
            if (!fs.existsSync(path.dirname(outputCssPath))) {
                fs.mkdirSync(path.dirname(outputCssPath), { recursive: true });
            }
            // Write the compiled CSS to the output file
            fs.writeFileSync(outputCssPath, result.css);
            if (log) {
                console.log(`[vite-plugin-dynamic-sass-themes] Compiled ${themeScssPath} to ${outputCssPath}`);
            }
            return result.css; // Return the compiled CSS
        }
        catch (error) {
            console.error(`[vite-plugin-dynamic-sass-themes] Error compiling ${themeScssPath}:`, error);
            return null;
        }
    };
    return {
        name: "vite-plugin-dynamic-sass-themes",
        // Development: Watch and compile themes
        configureServer(server) {
            const resolvedThemesDir = path.resolve(process.cwd(), themesDir);
            const resolvedOutputDir = path.resolve(process.cwd(), outputDir);
            // Watch for changes in the themes directory
            server.watcher.add(resolvedThemesDir);
            // Handle SASS file changes
            server.watcher.on("change", (filePath) => {
                if (filePath.endsWith(".scss")) {
                    const themeName = path.basename(path.dirname(filePath)); // e.g., 'light' or 'dark'
                    const outputCssPath = path.resolve(resolvedOutputDir, themeName, "theme.css");
                    // Compile the updated SASS file
                    const compiledCss = compileAndSaveTheme(filePath, outputCssPath);
                    if (compiledCss) {
                        // Notify the browser to update the CSS dynamically
                        server.ws.send({
                            type: "custom",
                            event: "vite-plugin-dynamic-sass-themes:update",
                            data: {
                                theme: themeName,
                                css: compiledCss, // Send the compiled CSS to the client
                            },
                        });
                    }
                }
            });
        },
        // Build: Copy and compile themes
        generateBundle() {
            const resolvedThemesDir = path.resolve(process.cwd(), themesDir);
            const resolvedOutputDir = path.resolve(process.cwd(), outputDir);
            // Get all theme directories (e.g., 'light', 'dark')
            const themeNames = fs.readdirSync(resolvedThemesDir);
            themeNames.forEach((themeName) => {
                const themeDir = path.join(resolvedThemesDir, themeName);
                const themeScssPath = path.join(themeDir, "theme.scss");
                // Check if the theme.scss file exists
                if (fs.existsSync(themeScssPath)) {
                    const outputCssPath = path.join(resolvedOutputDir, themeName, "theme.css");
                    compileAndSaveTheme(themeScssPath, outputCssPath);
                }
                else {
                    console.warn(`[vite-plugin-dynamic-sass-themes] No theme.scss found in ${themeDir}`);
                }
            });
        },
        // Inject client-side code as a virtual module
        resolveId(id) {
            if (id === "virtual:dynamic-sass-themes-client") {
                return id; // Return a virtual module ID
            }
        },
        load(id) {
            if (id === "virtual:dynamic-sass-themes-client") {
                // Return the client-side code as a module
                return `
          if (import.meta.hot) {
            import.meta.hot.on('vite-plugin-dynamic-sass-themes:update', (data) => {
              const { theme, css } = data;

              // Find or create a <style> element for the theme
              const styleId = 'dynamic-theme-' + theme;
              let styleElement = document.getElementById(styleId);

              if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
              }

              // Update the CSS content
              styleElement.textContent = css;

              console.log('[HMR] Updated theme: ' + theme);
            });
          }
        `;
            }
        },
    };
}
