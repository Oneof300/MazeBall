namespace MazeBall {
  export class Trigger extends f.Node {
    
    private readonly box: f.ComponentRigidbody;

    constructor(_pos: f.Vector3, _size: f.Vector3) {
      super("Trigger");

      this.addComponent(new f.ComponentTransform());
      this.mtxLocal.translate(_pos);
      this.mtxLocal.scale(_size);

      this.box = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
      this.box.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, (_event: f.EventPhysics) => this.dispatchEvent(_event));
      this.box.addEventListener(f.EVENT_PHYSICS.TRIGGER_EXIT, (_event: f.EventPhysics) => this.dispatchEvent(_event));
      this.addComponent(this.box);
    }
    
  }
}