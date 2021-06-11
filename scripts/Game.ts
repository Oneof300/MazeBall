namespace MazeBall {
  export class Game extends EventTarget {

    static readonly fps: number = 120;

    static readonly start: string = "gamestart";
    static readonly end: string = "gameend";
    static readonly reset: string = "gamereset";
    
    private readonly eventStart: Event = new Event(Game.start);
    private readonly eventEnd: Event = new Event(Game.end);
    private readonly eventReset: Event = new Event(Game.reset);

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
      f.Loop.start(f.LOOP_MODE.TIME_REAL, Game.fps);
    }

    private start = () => {
      this.isFinished = false;
      document.getElementById("message").className = "invisible";
      canvas.removeEventListener("click", this.start);
      canvas.requestPointerLock();
      
      this.dispatchEvent(this.eventStart);

      f.Loop.start(f.LOOP_MODE.TIME_REAL, Game.fps);
    }

  }

  export const game: Game = new Game();
}