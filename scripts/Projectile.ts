namespace MazeBall {
  export class Projectile extends f.Node {

    private body: f.ComponentRigidbody;

    constructor() {
      super("Projectile");

      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"] as f.Mesh);
      cmpMesh.mtxPivot.scale(f.Vector3.ONE(0.5));
      this.addComponent(cmpMesh);

      this.addComponent(new f.ComponentTransform());

      this.body = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE);
      this.addComponent(this.body);

      this.activate(false);
    }

    fire(_pos: f.Vector3, _force: f.Vector3): void {
      this.activate(true);
      this.mtxLocal.translate(f.Vector3.DIFFERENCE(_pos, this.mtxLocal.translation));
      this.body.applyForce(_force);
    }

  }
}