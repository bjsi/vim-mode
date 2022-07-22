import {usePlugin} from "@remnote/plugin-sdk";
import {KeyCommand} from "../../lib/types";
import {isYDC} from "../modes/predicates";
import {ModeProps, VimMode} from "../modes/types";
import * as Re from 'remeda';

interface RepeatBindingsProps extends ModeProps {
  RepeatFinalizer?: () => Promise<void>
}

export function useRepeatBindings(props: RepeatBindingsProps) {
  const makeRepeatCommand = (n: number) => {
    return {
      keyboardShortcut: n.toString(),
      action: async () => {
        const repeatN = props.repeatN.current * 10 + n
        props.repeatN.current = repeatN;
      }
    }
  }

  const bindings = Re.range(0, 10).reduce((acc, n) => { acc[`${n}`] = {id: `repeat ${n}`, name: `repeat ${n}`, ...makeRepeatCommand(n)}; return acc }, {} as Record<string, KeyCommand>)
  return bindings;
}
