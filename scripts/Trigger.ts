namespace PuzzleGame {
  export class Trigger extends f.Node {

    readonly box: f.ComponentRigidbody;

    constructor(_pos: f.Vector3, _size: f.Vector3) {
      super("Trigger");

      this.addComponent(new f.ComponentTransform());
      this.mtxLocal.translate(_pos);
      this.mtxLocal.scale(_size);

      this.box = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
      this.addComponent(this.box);
    }
  }
}