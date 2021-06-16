namespace MazeBall {
  export class TurnTable extends f.Node {

    private readonly axisX: f.Node;
    private readonly axisY: f.Node;
    private readonly axisZ: f.Node;

    constructor() {
      super("TurnTable");

      this.axisY = this;
      this.addComponent(new f.ComponentTransform());

      this.axisX = new f.Node("AxisX");
      this.axisX.addComponent(new f.ComponentTransform());
      super.addChild(this.axisX);

      this.axisZ = new f.Node("AxisZ");
      this.axisZ.addComponent(new f.ComponentTransform());
      this.axisX.addChild(this.axisZ);
      
      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
    }

    public addChild(_child: f.Node): void {
      this.axisZ.addChild(_child);
    }

    public rotateX(_angleInDegrees: number): void {
      const axis: f.Matrix4x4 = this.axisX.mtxLocal;
      axis.rotateX(_angleInDegrees);
      if (axis.rotation.x < -gameSettings.tiltMax) axis.rotateX(-gameSettings.tiltMax - axis.rotation.x);
      if (axis.rotation.x > gameSettings.tiltMax) axis.rotateX(gameSettings.tiltMax - axis.rotation.x);
    }

    public rotateY(_angleInDegrees: number): void {
      this.axisY.mtxLocal.rotateY(_angleInDegrees);
    }

    public rotateZ(_angleInDegrees: number): void {
      const axis: f.Matrix4x4 = this.axisZ.mtxLocal;
      axis.rotateZ(_angleInDegrees);
      if (axis.rotation.z < -gameSettings.tiltMax) axis.rotateZ(-gameSettings.tiltMax - axis.rotation.z);
      if (axis.rotation.z > gameSettings.tiltMax) axis.rotateZ(gameSettings.tiltMax - axis.rotation.z);
    }

    private onGameReset = (_event: Event) => {
      this.axisX.mtxLocal.rotateX(-this.axisX.mtxLocal.rotation.x);
      this.axisY.mtxLocal.rotateY(-this.axisY.mtxLocal.rotation.y);
      this.axisZ.mtxLocal.rotateZ(-this.axisZ.mtxLocal.rotation.z);
    }

  }
}