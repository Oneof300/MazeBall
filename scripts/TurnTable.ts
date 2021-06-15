namespace MazeBallScripts {
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
    }

    public addChild(_child: f.Node): void {
      this.axisZ.addChild(_child);
    }

    public rotateX(_angleInDegrees: number): void {
      const axis: f.Matrix4x4 = this.axisX.mtxLocal;
      axis.rotateX(_angleInDegrees);
      if (axis.rotation.x < -mb.gameSettings.tiltMax) axis.rotateX(-mb.gameSettings.tiltMax - axis.rotation.x);
      if (axis.rotation.x > mb.gameSettings.tiltMax) axis.rotateX(mb.gameSettings.tiltMax - axis.rotation.x);
    }

    public rotateY(_angleInDegrees: number): void {
      this.axisY.mtxLocal.rotateY(_angleInDegrees);
    }

    public rotateZ(_angleInDegrees: number): void {
      const axis: f.Matrix4x4 = this.axisZ.mtxLocal;
      axis.rotateZ(_angleInDegrees);
      if (axis.rotation.z < -mb.gameSettings.tiltMax) axis.rotateZ(-mb.gameSettings.tiltMax - axis.rotation.z);
      if (axis.rotation.z > mb.gameSettings.tiltMax) axis.rotateZ(mb.gameSettings.tiltMax - axis.rotation.z);
    }

  }
}