namespace MazeBall {
  
  export import f = FudgeCore;

  export enum EVENT_GAME {
    START = "gamestart",
    END = "gameend",
    RESET = "gamereset",
    SOLVED = "gamesolved"
  }

  interface GameSettings {

    fps: number;
    tiltSpeed: number;
    tiltMax: number;
    rotateSpeed: number;
    ballMass: number;
    cannonStrength: number;
    projectileMass: number;
    debugMode: f.PHYSICS_DEBUGMODE;
    debugDraw: boolean;

  }

  export let gameSettings: GameSettings;

  class Game extends EventTarget {

    #isFinished: boolean = false;
    #message: HTMLElement;
    #clock: HTMLElement;

    private readonly eventStart: Event = new Event(EVENT_GAME.START);
    private readonly eventEnd: Event = new Event(EVENT_GAME.END);
    private readonly eventReset: Event = new Event(EVENT_GAME.RESET);
    private readonly eventSolved: Event = new Event(EVENT_GAME.SOLVED);

    private timePassed: Date = new Date(0);

    get isFinished(): boolean {
      return this.#isFinished;
    }

    private get message(): HTMLElement {
      if (!this.#message) this.#message = document.getElementById("message");
      return this.#message;
    }

    private get clock(): HTMLElement {
      if (!this.#clock) this.#clock = document.getElementById("clock");
      return this.#clock;
    }

    requestClickToStart(): void {
      this.message.className = "blink";
      this.message.innerText = "click to start";

      canvas.addEventListener("click", this.start);
    }

    finish(_solved: boolean = true): void {      
      if (_solved) {
        this.message.className = "blink";
        this.message.innerText = "Finished!\nclick to reset";

        canvas.addEventListener("click", this.reset);
        this.dispatchEvent(this.eventSolved);
      }
      this.#isFinished = true;
      this.dispatchEvent(this.eventEnd);

      f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
      f.Loop.stop();
    }

    reset = () => {
      if (!this.isFinished) this.finish(false);
      else canvas.removeEventListener("click", this.reset);

      this.dispatchEvent(this.eventReset);

      this.clock.innerText = "0:00:000";
      this.requestClickToStart();
      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    }

    private start = () => {
      this.#isFinished = false;
      document.getElementById("message").className = "invisible";
      canvas.removeEventListener("click", this.start);
      canvas.requestPointerLock();
      
      this.dispatchEvent(this.eventStart);

      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private update = () => {
      const millisPassed: number = f.Time.game.get() - f.Loop.timeStartReal;
      this.timePassed = new Date(millisPassed > 0 ? millisPassed : 0);
      this.clock.innerText = this.timePassed.getMinutes() + ":"
        + this.timePassed.getSeconds().toLocaleString("en", {minimumIntegerDigits: 2}) + ":"
        + this.timePassed.getMilliseconds().toLocaleString("en", {minimumIntegerDigits: 3});
    }

  }

  export const game: Game = new Game();

}