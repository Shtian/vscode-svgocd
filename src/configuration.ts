import * as SVGO from 'svgo';
import * as vscode from 'vscode';

const readConfiguration = (): SVGO.Options => {
    const svgocdConfig = vscode.workspace.getConfiguration('svgocd');
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
