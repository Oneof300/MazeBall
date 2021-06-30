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

    #isRunning: boolean = false;
    #canvas: HTMLCanvasElement;
    #message: HTMLElement;
    #clock: HTMLElement;
    #finishedDialog: HTMLElement;
    #nameInput: HTMLInputElement;
    #time: HTMLElement;
    #menu: HTMLElement;

    private readonly eventStart: Event = new Event(EVENT_GAME.START);
    private readonly eventEnd: Event = new Event(EVENT_GAME.END);
    private readonly eventReset: Event = new Event(EVENT_GAME.RESET);
    private readonly eventSolved: Event = new Event(EVENT_GAME.SOLVED);

    private timePassed: Date = new Date(0);

    constructor() {
      super();
      window.addEventListener("keydown", this.onKeyDown);
    }

    get isRunning(): boolean {
      return this.#isRunning;
    }

    private get canvas(): HTMLElement {
      if (!this.#canvas) this.#canvas = document.querySelector("canvas");
      return this.#canvas;
    }

    private get message(): HTMLElement {
      if (!this.#message) this.#message = document.getElementById("message");
      return this.#message;
    }

    private get clock(): HTMLElement {
      if (!this.#clock) this.#clock = document.getElementById("clock");
      return this.#clock;
    }

    private get menu(): HTMLElement {
      if (!this.#menu) this.#menu = document.getElementById("menu");
      return this.#menu;
    }

    private get finishedDialog(): HTMLElement {
      if (!this.#finishedDialog) this.#finishedDialog = document.getElementById("finished_dialog");
      return this.#finishedDialog;
    }

    private get nameInput(): HTMLInputElement {
      if (!this.#nameInput) this.#nameInput = this.finishedDialog.querySelector("input");
      return this.#nameInput;
    }

    private get time(): HTMLElement {
      if (!this.#time) this.#time = document.getElementById("time");
      return this.#time;
    }

    requestClickToStart(): void {
      this.message.hidden = false;
      this.message.innerText = "click to start";

      window.addEventListener("click", this.start);
    }

    end(_solved: boolean = true): void {
      this.#isRunning = false;
      this.dispatchEvent(this.eventEnd);
      f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
      f.Loop.stop();
      
      if (_solved) {
        this.dispatchEvent(this.eventSolved);
        this.time.innerText = this.clock.innerText;
        this.finishedDialog.hidden = false;
        this.nameInput.focus();
        this.nameInput.addEventListener("keydown", this.onNameInputKeyDown);
      }
    }

    reset(): void {
      if (this.isRunning) this.end(false);
      else window.removeEventListener("click", this.reset);

      this.dispatchEvent(this.eventReset);

      this.clock.innerText = "0:00.00";
      this.requestClickToStart();
      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    }

    private start = () => {
      window.removeEventListener("click", this.start);
      this.#isRunning = true;
      this.message.hidden = true;
      this.canvas.requestPointerLock();
      
      this.dispatchEvent(this.eventStart);

      this.timePassed.setTime(0);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private update = () => {
      this.timePassed.setTime(this.timePassed.getTime() + f.Loop.timeFrameReal);
      this.clock.innerText
        = `${this.timePassed.getMinutes()}:${this.timePassed.getSeconds().toLocaleString("en", {minimumIntegerDigits: 2})}.`
        + Math.floor(this.timePassed.getMilliseconds() / 10).toLocaleString("en", {minimumIntegerDigits: 2});
    }

    private onKeyDown = (_event: KeyboardEvent) => {
      if (_event.code == f.KEYBOARD_CODE.ESC) {
        if (this.finishedDialog.hidden) {
          this.menu.hidden = !this.menu.hidden;
          document.exitPointerLock();
          f.Loop.stop();

          if (this.menu.hidden) {
            window.addEventListener("click", this.resume);
            if (this.isRunning) {
              this.message.innerText = "click to resume";
              this.message.hidden = false;
            }
          }
        }
        else {
          this.finishedDialog.removeEventListener("keydown", this.onNameInputKeyDown);
          this.finishedDialog.hidden = true;
          this.reset();
        }
      }
      if (_event.code == f.KEYBOARD_CODE.ENTER && this.finishedDialog.hidden) {
        console.log("enter");
        this.reset();
      }
    }

    private resume = () => {
      this.message.hidden = true;
      this.canvas.requestPointerLock();
      f.Loop.start();
    }

    private onNameInputKeyDown = (_event: KeyboardEvent) => {
      if (_event.code == f.KEYBOARD_CODE.ENTER) {
        this.finishedDialog.removeEventListener("keydown", this.onNameInputKeyDown);
        this.finishedDialog.hidden = true;
        this.registerHighscore();
        this.reset();
      }
    }

    private async registerHighscore(): Promise<void> {
      const path: string = "https://sftp.hs-furtwangen.de/~romingma/PRIMA/json_request.php";

      // get highscores
      const reponse: Response = await fetch(path);
      const json: Object = await reponse.json();
      const highscores: Array<[string, string]> = Array.from(Object.entries(json));

      // add highscore
      const existingScore: [string, string] = highscores.find(entry => entry[0] == this.nameInput.value);
      if (existingScore) {
        if (existingScore[1].localeCompare(this.time.innerText) > 0) existingScore[1] = this.time.innerText;
      }
      else highscores.push([this.nameInput.value, this.time.innerText]);

      console.log(highscores);

      // update highscores
      const params: string = highscores.map(entry => `${entry[0]}=${entry[1]}`).join("&");
      await fetch(`${path}?${params}`);
    }

  }

  export const game: Game = new Game();

}