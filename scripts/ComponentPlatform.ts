namespace MazeBall {
  export class ComponentPlatform extends ComponentScript {
  
    static readonly swapControlAudio: f.ComponentAudio =
      new f.ComponentAudio(new f.Audio("./resources/sounds/control_swap.mp3"));
    
    readonly turnTable: TurnTable;

    private readonly isFinal: boolean;
    private startPosition: f.Vector3;

    constructor(_final: boolean = false) {
      super();
      this.singleton = true;
      this.isFinal = _final;
      this.turnTable = new TurnTable();
    }

    protected onAdded(_event: Event): void {
      const node: f.Node = this.getContainer();

      node.getParent().addChild(this.turnTable);
      this.turnTable.mtxLocal.translate(node.mtxLocal.translation);
      node.mtxLocal.set(f.Matrix4x4.ROTATION(node.mtxLocal.rotation));
      this.turnTable.addChild(node);

      node.getChildrenByName("Floor").forEach(floor => {
        const body: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE);
        body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onFloorCollisionEnter);
        floor.addComponent(body);
      });
      
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
      
      node.getChildrenByName("Cannon").forEach(cannon => {
        cannon.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
        cannon.addComponent(new ComponentCannon(f.Vector3.Z(8.5), new f.Vector3(4, 4, 14)));
      });

      this.startPosition = this.getContainer().mtxLocal.translation;
      game.addEventListener(EVENT_GAME.RESET, this.onGameReset);
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
      if (playerControl.controlledPlatformTurntable != this.turnTable) {
        playerControl.controlledPlatformTurntable = this.turnTable;
        ComponentPlatform.swapControlAudio.play(true);
      }
    }

  }
}