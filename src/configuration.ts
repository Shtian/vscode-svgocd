import { Options, Js2SvgOptions } from 'svgo';
import { workspace, RelativePattern } from 'vscode';
import * as yaml from 'js-yaml';
import * as deepmerge from 'deepmerge';

const readExtensionConfiguration = <T>(section: string, value: string): T | null => {
  const configSection = workspace.getConfiguration(section);
  const configValue = configSection.get<T>(value);

  if (typeof configValue === 'undefined') {
    return null;
  }

  return configValue;
};

const readSVGOYamlConfiguration = async (): Promise<Options | null> => {
  const [rootFolder = null] = workspace.workspaceFolders || [];
  if (!rootFolder) {
    return null;
  }

  const [configFilePath] = await workspace.findFiles(new RelativePattern(rootFolder, '.svgo.{yml,yaml}'));
  if (!configFilePath) {
    return null;
  }

  const configFile = await workspace.openTextDocument(configFilePath);
  return yaml.safeLoad(configFile.getText());
};

const getSVGOJS2SVGConfig = (): Js2SvgOptions | undefined => {
  const js2svgConfig: Js2SvgOptions | undefined = readExtensionConfiguration<any>('svgocd', 'js2svg');
  return js2svgConfig;
};

const getSVGOPluginsConfig = (): any[] => {
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

export const getSVGOConfig = async (): Promise<Options> => {
  const plugins = getSVGOPluginsConfig();
  const js2svg = getSVGOJS2SVGConfig();
  const svgoYmlConfig = await readSVGOYamlConfiguration();
  if (!svgoYmlConfig) {
    return { plugins, js2svg };
  }

  return deepmerge({ plugins, js2svg }, svgoYmlConfig);
};
