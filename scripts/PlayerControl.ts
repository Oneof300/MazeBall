namespace MazeBall {
  export class PlayerControl extends f.Node {

    private static _instance: PlayerControl;

    viewObject: f.Node;
    controlledPlatform: f.Node;
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

    private constructor() {
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

      game.addEventListener(Game.start, this.onGameStart);
      game.addEventListener(Game.end, this.onGameEnd);
    }

    public static get instance(): PlayerControl {
      if (this._instance == undefined) this._instance = new PlayerControl();
      return this._instance;
    }

    private onGameStart = (_event: Event) => {
      this.controlledPlatform = scene.getChildrenByName("Platform")[0];
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      window.addEventListener("keydown", this.onKeyboardDown);
      canvas.addEventListener("mousemove", this.handleMouse);
      canvas.addEventListener("wheel", this.handleWheel);
    }

    private onGameEnd = (_event: Event) => {
      f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
      window.removeEventListener("keydown", this.onKeyboardDown);
      canvas.removeEventListener("mousemove", this.handleMouse);
      canvas.removeEventListener("wheel", this.handleWheel);
    }

    private update = (_event: Event) => {
      this.move();
    }

    private onKeyboardDown = (_event: f.EventKeyboard) => {
      if (this.rotateLeftKeys.includes(_event.code)) this.rotateLeft();
      else if (this.rotateRightKeys.includes(_event.code)) this.rotateRight();
    }

    private handleMouse = (_event: MouseEvent) => {
      this.controlledPlatform.mtxLocal.rotateX(_event.movementY * 0.05);
      this.controlledPlatform.mtxLocal.rotateZ(_event.movementX * -0.05);
    }
  
    private handleWheel = (_event: WheelEvent) => {
      this.controlledPlatform.mtxLocal.rotateY(_event.deltaY * 0.05);
    }

    private move(): void {
      let difference: f.Vector3 = f.Vector3.DIFFERENCE(this.viewObject.mtxLocal.translation, this.mtxLocal.translation);
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
}