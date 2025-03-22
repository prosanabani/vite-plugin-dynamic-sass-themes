import { Options } from "sass";
import { Plugin } from "vite";
interface DynamicSassThemePluginOptions {
    /** Directory containing theme SASS files (relative path). Default: `"src/themes"` */
    themesDir?: string;
    /** Output directory for compiled CSS (relative path). Default: `"public/themes"` */
    outputDir?: string;
    /** Enable/disable logging. Default: `true` */
    log?: boolean;
    /** Additional SASS options. Default: `{}` */
    sassOptions?: Options<"sync">;
}
/**
 * A Vite plugin to dynamically compile and inject SASS themes.
 * @param {DynamicSassThemePluginOptions} options - Configuration options for the plugin.
 * @returns {Plugin} - A Vite plugin instance.
 */
export default function dynamicSassThemePlugin(options?: DynamicSassThemePluginOptions): Plugin;
export {};
