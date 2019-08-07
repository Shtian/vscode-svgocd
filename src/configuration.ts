import * as SVGO from 'svgo';
import * as vscode from 'vscode';

const readConfiguration = (): SVGO.Options => {
    const svgocdConfig = vscode.workspace.getConfiguration('svgocd');
    const pluginsConf: [string]: any = svgocdConfig.get('plugins') ;
    const plugins = [];
    //TODO: fix types
    Object.keys(pluginsConf).map(c => {
        const propName = c as string;
        plugins.push({propName: pluginsConf[propName]})
    });
    return { plugins: [] };
};

export default readConfiguration;
