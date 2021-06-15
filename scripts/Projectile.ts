namespace MazeBallScripts {
  export class Projectile extends f.Node {

    private body: f.ComponentRigidbody;

    constructor() {
      super("Projectile");

      this.addComponent(new f.ComponentMesh(f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"] as f.Mesh));
      this.addComponent(new f.ComponentMaterial(f.Project.resources["Material|2021-05-25T15:28:46.097Z|64234"] as f.Material));
      this.addComponent(new f.ComponentTransform(f.Matrix4x4.SCALING(f.Vector3.ONE(0.75))));
      this.mtxLocal.translateY(-1);

      this.body = new f.ComponentRigidbody(mb.gameSettings.projectileMass, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.SPHERE,
                                           f.PHYSICS_GROUP.DEFAULT, this.mtxLocal);
      this.addComponent(this.body);

      this.activate(false);
    }

    fire(_pos: f.Vector3, _force: f.Vector3): void {
      this.activate(true);
      this.body.physicsType = f.PHYSICS_TYPE.DYNAMIC;
      this.body.setVelocity(f.Vector3.ZERO());
      this.body.setAngularVelocity(f.Vector3.ZERO());
      this.body.setPosition(_pos);
      this.body.applyForce(_force);
    }

  }
}