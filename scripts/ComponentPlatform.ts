namespace MazeBall {
  export class ComponentPlatform extends ComponentScript {
  
    public static readonly swapControlAudio: f.ComponentAudio =
      new f.ComponentAudio(new f.Audio("../resources/sounds/control_swap.mp3"));

    constructor() {
      super();
      this.singleton = true;
    }

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      node.getChildrenByName("Floor").forEach(floor => {
        let body: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE);
        body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollisionEnter);
        floor.addComponent(body);
      });
      
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
      
      node.getChildrenByName("Cannon").forEach(cannon => {
        cannon.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
        cannon.addComponent(new ComponentCannon(f.Vector3.Z(6), new f.Vector3(5, 10, 5)));
      });
    }

    private onCollisionEnter = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody.getContainer().name == "Ball") this.swapControl();
    }

    private swapControl(): void {
      if (controlledPlatform != this.getContainer().mtxLocal) {
        controlledPlatform = this.getContainer().mtxLocal;
        ComponentPlatform.swapControlAudio.play(true);
      }
    }

  }
}