/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Add types
import { Js2SvgOptions, loadConfig, OptimizeOptions } from 'svgo';
import { workspace } from 'vscode';
import * as deepmerge from 'deepmerge';

const readExtensionConfiguration = <T>(section: string, value: string): T | null => {
  const configSection = workspace.getConfiguration(section);
  const configValue = configSection.get<T>(value);

  if (typeof configValue === 'undefined') {
    return null;
  }

  return configValue;
};

const getSVGOJS2SVGExtensionSettings = (): Js2SvgOptions | undefined => {
  const js2svgConfig: Js2SvgOptions | undefined = readExtensionConfiguration<any>('svgocd', 'js2svg');
  return js2svgConfig;
};

const getSVGOExtensionSettings = (): any[] => {
  const pluginsValues = readExtensionConfiguration<any>('svgocd', 'plugins');
  // TODO: Read .svgo.y(a)ml with js.yaml
  const plugins: any[] = [];

  if (!pluginsValues) {
    return plugins;
  }

  Object.keys(pluginsValues).map((c) => {
    plugins.push({ [c]: pluginsValues[c] });
  });

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
  const svgoYmlConfig = await getSVGOFileConfig();
  if (!svgoYmlConfig) {
    return { plugins, js2svg };
  }

  return deepmerge({ plugins, js2svg }, svgoYmlConfig);
};
