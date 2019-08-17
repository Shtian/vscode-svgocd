import { commands, ExtensionContext, workspace } from 'vscode';
import optimizeSVG from './optimizeSVG';

export function activate(context: ExtensionContext) {
    const svgocd = new optimizeSVG();

    // Register Run command
    let disposable = commands.registerCommand('svgocd.run-current', () => {
        svgocd.optimizeSVG();
    });
    context.subscriptions.push(disposable);

    // Refresh svgocd config on relevant change
    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('svgocd')) {
                svgocd.readConfiguration();
            }
        })
    );
}

export function deactivate() {}
