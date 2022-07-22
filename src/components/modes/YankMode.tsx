import { usePlugin, } from "@remnote/plugin-sdk";
import {useModalEditorBindings} from "../../lib/bindings";
import {ModeProps, VimMode} from "./types";
import {KeyCommand} from "../../lib/types";
import { useMakeCommand } from '../../lib/hooks';
import {useMoveBindings} from "../bindings/Move";

interface YankCopyDeleteModesProps extends ModeProps { }

export const YankMode = (props: YankCopyDeleteModesProps) => {
  const plugin = usePlugin();
  const moveBindings = useMoveBindings(props);
  const makeCommand = useMakeCommand();
  const yankBindings: Record<string, KeyCommand> = {
    ...moveBindings,
    'y': {
      id: "yank line",
      name: "yank line",
      ...makeCommand('y', async () => {
        const sel = await plugin.editor.getLinearSelection();
        await plugin.editor.moveCaret(-1, 1, 6);
        await plugin.editor.copySelection();
        await plugin.editor.setLinearSelection(sel);
      })
    },
    'i': {
      id: "yank inner",
      name: "yank inner",
      ...makeCommand('i', async () => {
      })
    }
  }

  useModalEditorBindings(VimMode.Yank, props.currentMode, props.previousMode, yankBindings)
  return null
}
