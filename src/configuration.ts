import { Options } from 'svgo';
import { workspace } from 'vscode';

export const readConfiguration = (section: string, value: string): any => {
    const configSection = workspace.getConfiguration(section);
    const configValue = configSection.get<any>(value);

    if (typeof configValue === 'undefined') {
        return null;
    }

    return configValue;
};

export const getSVGOPluginsConfig = (): Options => {
    const pluginsValues = readConfiguration('svgocd', 'plugins');
    // TODO: Read .svgo.y(a)ml with js.yaml
    const plugins: any[] = [];

    if (!pluginsValues) {
        return { plugins };
    }

    Object.keys(pluginsValues).map((c) => {
        plugins.push({ [c]: pluginsValues[c] });
    });

    return { plugins };
};
