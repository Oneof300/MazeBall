namespace MazeBall {
  class PlayerControl extends f.Node {

    viewObject: f.Node;
    startPlatformTurntable: TurnTable;
    controlledPlatformTurntable: TurnTable;
    readonly camera: f.ComponentCamera;

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
      this.camera.mtxPivot.translateZ(30);
      this.camera.mtxPivot.rotateY(180);
      this.camera.mtxPivot.rotateX(45);
      this.turnTable.addComponent(this.camera);

      this.addChild(this.turnTable);

      game.addEventListener(EVENT_GAME.START, this.onGameStart);
      game.addEventListener(EVENT_GAME.END, this.onGameEnd);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private onGameStart = (_event: Event) => {
      this.controlledPlatformTurntable = this.startPlatformTurntable;
      window.addEventListener("keydown", this.onKeyboardDown);
      canvas.addEventListener("mousemove", this.onMouseMove);
      canvas.addEventListener("wheel", this.onWheel);
    }

    private onGameEnd = (_event: Event) => {
      window.removeEventListener("keydown", this.onKeyboardDown);
      canvas.removeEventListener("mousemove", this.onMouseMove);
      canvas.removeEventListener("wheel", this.onWheel);
    }

    private update = (_event: Event) => {
      this.move();
    }

    private onKeyboardDown = (_event: f.EventKeyboard) => {
      if (this.rotateLeftKeys.includes(_event.code)) this.rotateLeft();
      else if (this.rotateRightKeys.includes(_event.code)) this.rotateRight();
    }

    private onMouseMove = (_event: MouseEvent) => {
      this.controlledPlatformTurntable.rotateX(_event.movementY * gameSettings.tiltSpeed);
      this.controlledPlatformTurntable.rotateZ(_event.movementX * -gameSettings.tiltSpeed);
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