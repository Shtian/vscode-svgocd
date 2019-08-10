import { Options } from 'svgo';
import { workspace } from 'vscode';

const readConfiguration = (): Options => {
    const svgocdConfig = workspace.getConfiguration('svgocd');
    const pluginsConf = svgocdConfig.get<any>('plugins');

    if (typeof pluginsConf === 'undefined') {
        return { plugins: [] };
    }

    const plugins: any[] = [];

    Object.keys(pluginsConf).map((c) => {
        plugins.push({ [c]: pluginsConf[c] });
    });

    return { plugins };
};

export default readConfiguration;
