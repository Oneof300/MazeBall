namespace MazeBall {
  export class Projectile extends f.Node {

    private readonly body: f.ComponentRigidbody;

    constructor(_color: f.Color) {
      super("Projectile");

      this.addComponent(new f.ComponentMesh(f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"] as f.Mesh));

      const material: f.ComponentMaterial
        = new f.ComponentMaterial(f.Project.resources["Material|2021-05-25T15:28:46.097Z|64234"] as f.Material);
      material.clrPrimary = _color;
      this.addComponent(material);

      this.addComponent(new f.ComponentTransform());
      this.mtxLocal.scale(f.Vector3.ONE(0.75));
      this.mtxLocal.translateY(-1);

      this.body = new f.ComponentRigidbody(gameSettings.projectileMass, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.SPHERE,
                                           f.PHYSICS_GROUP.DEFAULT, this.mtxLocal);
      this.addComponent(this.body);

      this.activate(false);

      game.addEventListener(EVENT_GAME.RESET, this.onReset);
    }

    fire(_pos: f.Vector3, _force: f.Vector3): void {
      this.activate(true);
      this.body.physicsType = f.PHYSICS_TYPE.DYNAMIC;
      this.body.setVelocity(f.Vector3.ZERO());
      this.body.setAngularVelocity(f.Vector3.ZERO());
      this.body.setPosition(_pos);
      this.body.applyForce(_force);
    }

    private onReset = (_event: Event) => {
      this.body.setPosition(f.Vector3.Y(-1));
      this.body.physicsType = f.PHYSICS_TYPE.STATIC;
      this.activate(false);
    }

  }
}