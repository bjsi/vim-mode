import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerWidget('vim', WidgetLocation.RightSidebar, {
    dimensions: { height: 'auto', width: '100%' },
  });

  await plugin.app.registerCommand({
    name: 'do somethign',
    id: 'sdsadsadk',
    action: async () => {
      // const curRem = await plugin.focus.getFocusedRem();
      // const children = (await curRem?.getChildrenRem()) || []
      // plugin.editor.selectRem([curRem!._id, children[0]._id])
      const sel = await plugin.editor.getFocusedEditorText();
      console.log(sel);
    },
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
