import { BuiltinPluginWithOptionalParams, Config, PluginConfig } from 'svgo';
import { window, workspace } from 'vscode';
import deepmerge = require('deepmerge');
import { StringifyOptions } from 'svgo/lib/types';

type VSCodeSVGOConfigValueType = {
  [key: string]: boolean | object;
};

const readExtensionConfiguration = <T>(section: string, value: string): T | null => {
  const configSection = workspace.getConfiguration(section);
  const configValue = configSection.get<T>(value);

  if (typeof configValue === 'undefined') {
    return null;
  }

  return configValue;
};

const getSVGOJS2SVGExtensionSettings = (): StringifyOptions | undefined => {
  const js2svgConfig = readExtensionConfiguration<StringifyOptions>('svgocd', 'js2svg');
  return js2svgConfig === null ? undefined : js2svgConfig;
};

const getSVGOExtensionSettings = (): PluginConfig[] => {
  const pluginsValues = readExtensionConfiguration<VSCodeSVGOConfigValueType>('svgocd', 'plugins');

  if (!pluginsValues) {
    return [];
  }

  const plugins = Object.keys(pluginsValues)
    .map((pluginKey) => {
      const pluginValue = pluginsValues[pluginKey];
      if (typeof pluginValue === 'boolean' && pluginValue) {
        return pluginKey as BuiltinPluginWithOptionalParams['name'];
      }
      if (typeof pluginValue === 'object') {
        return { name: pluginKey, params: pluginValue } as BuiltinPluginWithOptionalParams;
      }
    })
    .filter((plugin) => typeof plugin !== 'undefined') as PluginConfig[];
  return plugins;
};

const getSVGOFileConfig = async (): Promise<Config | null> => {
  const [configFile] = await workspace.findFiles('**/svgo.config.{js,cjs,mjs}', '**/node_modules/**', 1);
  if (!configFile) return null;

  try {
    if (configFile.path.endsWith('.mjs')) {
      throw Error('ESM config files are not supported yet');
    }

    // Reload the config file in case of changes
    const requireCacheKeys = Object.keys(require.cache);
    for (const key of requireCacheKeys) {
      if (key === configFile.fsPath) {
        delete require.cache[key];
        break;
      }
    }

    // VS Code extension runs in a CommonJS context, so we need to use require() here
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(configFile.fsPath);
    if (config == null || typeof config !== 'object' || Array.isArray(config)) {
      throw Error(`Invalid config file "${configFile}"`);
    }
    return config;
  } catch (error) {
    window.showErrorMessage(`Error loading svgo config file: ${error}`);
    return null;
  }
};

export const getSVGOConfig = async (): Promise<Config> => {
  const plugins = getSVGOExtensionSettings();
  const js2svg = getSVGOJS2SVGExtensionSettings();
  const svgoConfigFile = await getSVGOFileConfig();
  const extensionSettings = { plugins, js2svg } as Config;
  if (!svgoConfigFile) {
    return extensionSettings;
  }

  return deepmerge(extensionSettings, svgoConfigFile);
};
