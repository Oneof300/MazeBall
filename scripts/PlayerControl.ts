namespace MazeBall {
  class PlayerControl extends f.Node {

    viewObject: f.Node;

    readonly camera: f.ComponentCamera;

    #controlledPlatformTurntable: TurnTable;
    #audioControlSwap: f.ComponentAudio;
    #audioFinish: f.ComponentAudio;

    private readonly rotateLeftKeys: string[] = [
      f.KEYBOARD_CODE.A,
      f.KEYBOARD_CODE.ARROW_LEFT
    ];

    private readonly rotateRightKeys: string[] = [
      f.KEYBOARD_CODE.D,
      f.KEYBOARD_CODE.ARROW_RIGHT
    ];

    private readonly turnTable: f.Node;

    constructor() {
      super("PlayerControl");
      this.addComponent(new f.ComponentTransform());
      
      this.turnTable = new f.Node("Camera");
      this.turnTable.addComponent(new f.ComponentTransform());

      this.camera = new f.ComponentCamera();
      this.camera.mtxPivot.translateY(30);
      this.camera.mtxPivot.translateZ(-30);
      this.camera.mtxPivot.rotateX(45);
      this.camera.clrBackground = f.Color.CSS("DeepSkyBlue");
      this.turnTable.addComponent(this.camera);

      this.addChild(this.turnTable);

      game.addEventListener(EVENT_GAME.START, this.onGameStart);
      game.addEventListener(EVENT_GAME.END, this.onGameEnd);
      game.addEventListener(EVENT_GAME.SOLVED, this.onGameSolved);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }



    get controlledPlatformTurntable(): TurnTable {
      return this.#controlledPlatformTurntable;
    }

    set controlledPlatformTurntable(_value: TurnTable) {
      if (_value != this.#controlledPlatformTurntable) {
        this.#controlledPlatformTurntable = _value;
        this.audioControlSwap?.play(true);
      }
    }

    get audioControlSwap(): f.ComponentAudio {
      if (!this.#audioControlSwap) {
        const audio: f.Audio = getResourceByName("AudioControlSwap") as f.Audio;
        if (audio) {
          this.#audioControlSwap = new f.ComponentAudio(audio);
          this.#audioControlSwap.volume = 1;
          this.addComponent(this.#audioControlSwap);
        }
      }
      return this.#audioControlSwap;
    }

    get audioFinish(): f.ComponentAudio {
      if (!this.#audioFinish) {
        const audio: f.Audio = getResourceByName("AudioFinish") as f.Audio;
        if (audio) {
          this.#audioFinish = new f.ComponentAudio(audio);
          this.#audioFinish.volume = 0.5;
          this.addComponent(this.#audioFinish);
        }
      }
      return this.#audioFinish;
    }

    private onGameStart = (_event: Event) => {
      window.addEventListener("keydown", this.onKeyboardDown);
      canvas.addEventListener("mousemove", this.onMouseMove);
      canvas.addEventListener("wheel", this.onWheel);
    }

    private onGameEnd = (_event: Event) => {
      window.removeEventListener("keydown", this.onKeyboardDown);
      canvas.removeEventListener("mousemove", this.onMouseMove);
      canvas.removeEventListener("wheel", this.onWheel);
    }

    private onGameSolved = (_event: Event) => {
      this.audioFinish?.play(true);
    }

    private update = (_event: Event) => {
      this.move();
    }

    private onKeyboardDown = (_event: f.EventKeyboard) => {
      if (this.rotateLeftKeys.includes(_event.code)) this.rotateLeft();
      else if (this.rotateRightKeys.includes(_event.code)) this.rotateRight();
    }

    private onMouseMove = (_event: MouseEvent) => {
      const forward: f.Vector3 = this.turnTable.mtxLocal.getZ();
      this.controlledPlatformTurntable.rotateX((forward.x * _event.movementX - forward.z * _event.movementY) * gameSettings.tiltSpeed);
      this.controlledPlatformTurntable.rotateZ((forward.x * _event.movementY + forward.z * _event.movementX) * gameSettings.tiltSpeed);
    }
  
    private onWheel = (_event: WheelEvent) => {
      this.controlledPlatformTurntable.rotateY(_event.deltaY * gameSettings.rotateSpeed);
    }

    private move(): void {
      const difference: f.Vector3 = f.Vector3.DIFFERENCE(this.viewObject.mtxLocal.translation, this.mtxLocal.translation);
      difference.scale(1 / (1 + difference.magnitude));
      this.mtxLocal.translate(difference);
    }

    private rotateLeft(): void {
      this.turnTable.mtxLocal.rotateY(-90);
    }

    private rotateRight(): void {
      this.turnTable.mtxLocal.rotateY(90);
    }
  }

  export const playerControl: PlayerControl = new PlayerControl();
}