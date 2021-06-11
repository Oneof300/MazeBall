namespace MazeBall {
  export class ComponentPlatform extends ComponentScript {
  
    public static readonly swapControlAudio: f.ComponentAudio =
      new f.ComponentAudio(new f.Audio("./resources/sounds/control_swap.mp3"));

    private readonly isFinal: boolean;
    private startPosition: f.Vector3;

    constructor(_final: boolean = false) {
      super();
      this.singleton = true;
      this.isFinal = _final;
    }

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      node.getChildrenByName("Floor").forEach(floor => {
        let body: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE);
        body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onFloorCollisionEnter);
        floor.addComponent(body);
      });
      
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
      
      node.getChildrenByName("Cannon").forEach(cannon => {
        cannon.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
        cannon.addComponent(new ComponentCannon(f.Vector3.Z(6), new f.Vector3(5, 10, 5)));
      });

      this.startPosition = this.getContainer().mtxLocal.translation;
      game.addEventListener(Game.reset, this.onGameReset);
    }

    protected onFloorCollisionEnter = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody.getContainer().name == "Ball") {
        if (this.isFinal) game.finish();
        else this.swapControl();
      }
    }

    private onGameReset = (_event: Event) => {
      this.getContainer().mtxLocal.set(f.Matrix4x4.TRANSLATION(this.startPosition));
    }

    private swapControl(): void {
      if (PlayerControl.instance.controlledPlatform != this.getContainer()) {
        PlayerControl.instance.controlledPlatform = this.getContainer();
        ComponentPlatform.swapControlAudio.play(true);
      }
    }

  }
}