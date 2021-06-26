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

    constructor() {
      super();
      window.addEventListener("keydown", this.onKeyDown);
    }

    get isRunning(): boolean {
      return this.#isRunning;
    }

    private get message(): HTMLElement {
      if (!this.#message) this.#message = document.getElementById("message");
      return this.#message;
    }

    private get clock(): HTMLElement {
      if (!this.#clock) this.#clock = document.getElementById("clock");
      return this.#clock;
    }

    private get finishedDialog(): HTMLElement {
      if (!this.#finishedDialog) this.#finishedDialog = document.getElementById("finished_dialog");
      return this.#finishedDialog;
    }

    private get nameInput(): HTMLInputElement {
      if (!this.#nameInput) this.#nameInput = document.getElementById("name") as HTMLInputElement;
      return this.#nameInput;
    }

    private get time(): HTMLElement {
      if (!this.#time) this.#time = document.getElementById("time");
      return this.#time;
    }

    private get menu(): HTMLElement {
      if (!this.#menu) this.#menu = document.getElementById("menu");
      return this.#menu;
    }

    requestClickToStart(): void {
      this.message.hidden = false;
      this.message.innerText = "click to start";

      canvas.addEventListener("click", this.start);
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
        this.finishedDialog.addEventListener("keydown", this.onFinishedDialogKeyDown);
      }
    }

    private reset(): void {
      if (this.isRunning) this.end(false);
      else canvas.removeEventListener("click", this.reset);

      this.dispatchEvent(this.eventReset);

      this.clock.innerText = "0:00:000";
      this.requestClickToStart();
      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    }

    private start = () => {
      this.#isRunning = false;
      this.message.hidden = true;
      canvas.removeEventListener("click", this.start);
      canvas.requestPointerLock();
      
      this.dispatchEvent(this.eventStart);

      f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private update = () => {
      const millisPassed: number = f.Time.game.get() - f.Loop.timeStartReal;
      const timePassed: Date = new Date(millisPassed > 0 ? millisPassed : 0);
      this.clock.innerText
        = `${timePassed.getMinutes()}:${timePassed.getSeconds().toLocaleString("en", {minimumIntegerDigits: 2})}:`
        + timePassed.getMilliseconds().toLocaleString("en", {minimumIntegerDigits: 3});
    }

    private onKeyDown = (_event: KeyboardEvent) => {
      if (_event.code == f.KEYBOARD_CODE.ESC) {
        console.log("esc");
        if (this.finishedDialog.hidden) this.menu.hidden = !this.menu.hidden;
      }
    }

    private onFinishedDialogKeyDown = (_event: KeyboardEvent) => {
      if (_event.code == f.KEYBOARD_CODE.ENTER) {
        this.registerHighscore();
        this.finishedDialog.hidden = true;
        this.reset();
        this.finishedDialog.removeEventListener("keydown", this.onFinishedDialogKeyDown);
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