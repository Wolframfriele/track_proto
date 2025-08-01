import { Command } from "../command.service";

export const NormalModeMap = new Map<string, Command>([
  ['i', Command.SWITCH_TO_INSERT_MODE],
  ['v', Command.SWITCH_TO_VISUAL_MODE],
  [':', Command.SWITCH_TO_COMMAND_MODE],
  ['o', Command.ADD_NEW_CHILD_ENTRY],
  ['ArrowUp', Command.MOVE_TO_PREVIOUS_ENTRY],
  ['ArrowDown', Command.MOVE_TO_NEXT_ENTRY],
  ['Enter', Command.ADD_NEW_ENTRY],
  ['o', Command.ADD_NEW_CHILD_ENTRY],
]);
