namespace MazeBall {
  export class Game extends EventTarget {

    static readonly start: string = "gamestart";
    static readonly end: string = "gameend";
    
    private _start: Event = new Event(Game.start);
    private _end: Event = new Event(Game.end);

    requestClickToStart(): void {
      let startMessage: HTMLDivElement = document.createElement("div");
      startMessage.className = "blink";
      startMessage.innerText = "click to start";
      document.body.appendChild(startMessage);

      canvas.addEventListener("click", () => {
        this.start();
        canvas.requestPointerLock();
        document.body.removeChild(startMessage);
      });
    }

    start(): void {
      this.dispatchEvent(this._start);
      f.Loop.start(f.LOOP_MODE.TIME_REAL, 120);
    }

    end(): void {
      this.dispatchEvent(this._end);
      f.Loop.stop();
      this.requestClickToStart();
    }

  }

  export const game: Game = new Game();
}