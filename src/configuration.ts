import { Options, Js2SvgOptions } from 'svgo';
import { workspace } from 'vscode';

const readExtensionConfiguration = <T>(section: string, value: string): T | null => {
    const configSection = workspace.getConfiguration(section);
    const configValue = configSection.get<T>(value);

    if (typeof configValue === 'undefined') {
        return null;
    }

    return configValue;
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

export const getSVGOConfig = (): Options => {
    const plugins = getSVGOPluginsConfig();
    const js2svg = getSVGOJS2SVGConfig();

    return { plugins, js2svg };
};
