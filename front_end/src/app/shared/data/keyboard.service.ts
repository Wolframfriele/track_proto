import { computed, inject, Injectable, signal } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { Command, CommandService } from './command.service';
import { NormalModeMap } from './keymaps/normal-mode.map';
import { CommandModeMap } from './keymaps/command-mode.map';
import { VisualModeMap } from './keymaps/visual-mode.map';
import { InsertModeMap } from './keymaps/insert-mode.map';

export enum ControlMode {
  NORMAL_MODE = "Normal",
  INSERT_MODE = "Insert",
  VISUAL_MODE = "Visual",
  COMMAND_MODE = "Command",
}

interface State {
  activeControlMode: ControlMode,
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  commandService = inject(CommandService);

  private state = signal<State>({
    activeControlMode: ControlMode.NORMAL_MODE,
  })

  // selectors
  activeControlMode = computed(() => this.state().activeControlMode);

  keyboard$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  )

  constructor() {
    this.commandService.executeCommand$.subscribe(
      (command) => {
        switch (command) {
          case Command.SWITCH_TO_NORMAL_MODE:
            (document.activeElement as HTMLElement).blur();
            this.state.set({ activeControlMode: ControlMode.NORMAL_MODE });
            break;
          case Command.SWITCH_TO_INSERT_MODE:
            this.state.set({ activeControlMode: ControlMode.INSERT_MODE });
            break;
          case Command.SWITCH_TO_VISUAL_MODE:
            (document.activeElement as HTMLElement).blur();
            this.state.set({ activeControlMode: ControlMode.VISUAL_MODE });
            break;
          case Command.SWITCH_TO_COMMAND_MODE:
            (document.activeElement as HTMLElement).blur();
            this.state.set({ activeControlMode: ControlMode.COMMAND_MODE });
            break;
        }
      }
    )

    this.keyboard$.subscribe(
      (keyEvent) => {
        // console.log(keyEvent.key);
        switch (this.activeControlMode()) {
          case ControlMode.NORMAL_MODE:
            const normalKeymapping = NormalModeMap.get(keyEvent.key);
            if (normalKeymapping) {
              keyEvent.preventDefault();
              this.commandService.executeCommand$.next(normalKeymapping);
            }
            break;

          case ControlMode.INSERT_MODE:
            const insertKeymapping = InsertModeMap.get(keyEvent.key);
            if (insertKeymapping) {
              keyEvent.preventDefault();
              this.commandService.executeCommand$.next(insertKeymapping);
            }
            break;

          case ControlMode.VISUAL_MODE:
            const visualKeymapping = VisualModeMap.get(keyEvent.key);
            if (visualKeymapping) {
              keyEvent.preventDefault();
              this.commandService.executeCommand$.next(visualKeymapping);
            }
            break

          case ControlMode.COMMAND_MODE:
            const commandKeymapping = CommandModeMap.get(keyEvent.key);
            if (commandKeymapping) {
              keyEvent.preventDefault();
              this.commandService.executeCommand$.next(commandKeymapping);
            }
            break
        }
      });
  }
}
