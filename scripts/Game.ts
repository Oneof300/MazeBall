namespace MazeBall {

  export enum EVENT_GAME {
    START = "gamestart",
    END = "gameend",
    RESET = "gamereset"
  }

  interface GameSettings {

    fps: number;
    tiltSpeed: number;
    rotateSpeed: number;
    debugMode: string;
    debugDraw: boolean;

  }

  export let gameSettings: GameSettings;

  class Game extends EventTarget {
    
    private readonly eventStart: Event = new Event(EVENT_GAME.START);
    private readonly eventEnd: Event = new Event(EVENT_GAME.END);
    private readonly eventReset: Event = new Event(EVENT_GAME.RESET);

    private isFinished: boolean = false;

    requestClickToStart(): void {
      let message: HTMLElement = document.getElementById("message");
      message.className = "blink";
      message.innerText = "click to start";

      canvas.addEventListener("click", this.start);
    }

    finish(_solved: boolean = true): void {      
      if (_solved) {
        let message: HTMLElement = document.getElementById("message");
        message.className = "blink";
        message.innerText = "Finished!\nclick to reset";

        canvas.addEventListener("click", this.reset);
      }
      this.isFinished = true;
      this.dispatchEvent(this.eventEnd);

      f.Loop.stop();
    }

    reset = () => {
      if (!this.isFinished) this.finish(false);
      else canvas.removeEventListener("click", this.reset);

      this.dispatchEvent(this.eventReset);

      this.requestClickToStart();
      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    }

    private start = () => {
      this.isFinished = false;
      document.getElementById("message").className = "invisible";
      canvas.removeEventListener("click", this.start);
      canvas.requestPointerLock();
      
      this.dispatchEvent(this.eventStart);

      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    }

  }

  export const game: Game = new Game();

}