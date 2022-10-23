import { DefaultPlugins, Js2SvgOptions, loadConfig, OptimizeOptions, Plugin } from 'svgo';
import { workspace } from 'vscode';
import * as deepmerge from 'deepmerge';

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

const getSVGOJS2SVGExtensionSettings = (): Js2SvgOptions | undefined => {
  const js2svgConfig = readExtensionConfiguration<Js2SvgOptions>('svgocd', 'js2svg');
  return js2svgConfig === null ? undefined : js2svgConfig;
};

const getSVGOExtensionSettings = (): Plugin[] => {
  const pluginsValues = readExtensionConfiguration<VSCodeSVGOConfigValueType>('svgocd', 'plugins');

  if (!pluginsValues) {
    return [];
  }

  const plugins = Object.keys(pluginsValues)
    .map((pluginKey) => {
      const pluginValue = pluginsValues[pluginKey];
      if (typeof pluginValue === 'boolean' && pluginValue) {
        return pluginKey as DefaultPlugins['name'];
      }
      if (typeof pluginValue === 'object') {
        return { name: pluginKey, params: pluginValue } as Plugin;
      }
    })
    .filter((plugin) => typeof plugin !== 'undefined') as Plugin[];
  return plugins;
};

const getSVGOFileConfig = async (): Promise<OptimizeOptions | null> => {
  const [configFiles] = await workspace.findFiles('**/svgo.config.{js,mjs,cjs}', '**/node_modules/**', 1);
  if (!configFiles) return null;
  return loadConfig(configFiles.fsPath);
};

export const getSVGOConfig = async (): Promise<OptimizeOptions> => {
  const plugins = getSVGOExtensionSettings();
  const js2svg = getSVGOJS2SVGExtensionSettings();
  const svgoConfigFile = await getSVGOFileConfig();
  const extensionSettings = { plugins, js2svg } as OptimizeOptions;
  if (!svgoConfigFile) {
    return extensionSettings;
  }

  return deepmerge(extensionSettings, svgoConfigFile);
};
