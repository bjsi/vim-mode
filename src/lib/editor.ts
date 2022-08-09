import { RNPlugin } from '@remnote/plugin-sdk';

export const cutSelection = async (plugin: RNPlugin) => {
  await copySelection(plugin);
  await plugin.editor.deleteRange();
};

export const copySelection = async (plugin: RNPlugin) => {
  const copiedRichText = await plugin.editor.getSelectedRichText();
  const html = await plugin.richText.toHTML(copiedRichText);
  const htmlInput = new Blob([html], { type: 'text/html' });
  const htmlClipboardItem = new ClipboardItem({
    'text/html': htmlInput,
  });
  await navigator.clipboard.write([htmlClipboardItem]);
};
