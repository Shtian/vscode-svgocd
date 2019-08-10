import { commands, ExtensionContext } from 'vscode';
import optimizeSVG from './optimizeSVG';

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('extension.svgocd', () => {
        optimizeSVG();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
