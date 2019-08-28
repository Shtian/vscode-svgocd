import { commands, ExtensionContext, workspace } from 'vscode';
import SVGOCD from './optimizeSVG';

export function activate(context: ExtensionContext): void {
  const svgocd = new SVGOCD();

  // Register Run command
  const disposable = commands.registerCommand('svgocd.run', () => {
    svgocd.optimizeSVG();
  });
  context.subscriptions.push(disposable);

  // Refresh svgocd config on relevant change
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('svgocd')) {
        svgocd.readConfiguration();
      }
    }),
    workspace.onDidSaveTextDocument(doc => {
      if (/(\.svgo\.ya?ml)/.test(doc.fileName)) {
        svgocd.readConfiguration();
      }
    }),
    workspace.onDidChangeWorkspaceFolders(() => {
      svgocd.readConfiguration();
    })
  );
}
