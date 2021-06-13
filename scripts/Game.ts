namespace MazeBall {

  export enum EVENT_GAME {
    START = "gamestart",
    END = "gameend",
    RESET = "gamereset"
  }

  interface GameSettings {

    fps: number;
    tiltSpeed: number;
    tiltMax: number;
    rotateSpeed: number;
    ballMass: number;
    cannonStrength: number;
    projectileMass: number;
    debugMode: string;
    debugDraw: boolean;

  }

  export let gameSettings: GameSettings;

  class Game extends EventTarget {
    
    private readonly eventStart: Event = new Event(EVENT_GAME.START);
    private readonly eventEnd: Event = new Event(EVENT_GAME.END);
    private readonly eventReset: Event = new Event(EVENT_GAME.RESET);

    private isFinished: boolean = false;
    private timePassed: Date = new Date(0);
    private clock: HTMLElement;

    constructor() {
      super();
      window.addEventListener("load", () => {
        this.clock = document.getElementById("clock");
        this.clock.innerText = "0:00:000";
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      });
    }

    requestClickToStart(): void {
      const message: HTMLElement = document.getElementById("message");
      message.className = "blink";
      message.innerText = "click to start";

      canvas.addEventListener("click", this.start);
    }

    finish(_solved: boolean = true): void {      
      if (_solved) {
        const message: HTMLElement = document.getElementById("message");
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

    private update = () => {
      this.timePassed = new Date(f.Time.game.get() - f.Loop.timeStartReal);
      this.clock.innerText = this.timePassed.getMinutes() + ":" 
        + this.timePassed.getSeconds().toLocaleString("en", {minimumIntegerDigits: 2}) + ":"
        + this.timePassed.getMilliseconds().toLocaleString("en", {minimumIntegerDigits: 3});
    }

  }

  export const game: Game = new Game();

}