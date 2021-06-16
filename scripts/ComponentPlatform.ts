namespace MazeBallScripts {
  export class ComponentPlatform extends ComponentScript {
    
    #turnTable: MazeBall.TurnTable;

    private isFinal: boolean;

    constructor(_final: boolean = false) {
      super();
      this.singleton = true;
      this.isFinal = _final;
    }

    protected onAdded(_event: Event): void {
      this.getContainer().addEventListener(f.EVENT.CHILD_APPEND, this.onChildAppend);
    }

    private onChildAppend = (_event: Event) => {
      if (_event.currentTarget == _event.target) {
        // this components node has been appended
        const node: f.Node = this.getContainer();
        node.removeEventListener(f.EVENT.CHILD_APPEND, this.onChildAppend);

        if (!this.isFinal) {
          // Append turn table
          this.#turnTable = new MazeBall.TurnTable();
          node.getParent().addChild(this.#turnTable);
          this.#turnTable.mtxLocal.translate(node.mtxLocal.translation);
          node.mtxLocal.set(f.Matrix4x4.ROTATION(node.mtxLocal.rotation));
          this.#turnTable.addChild(node);
        }

        this.addRigidBodies();
      }
    }

    private onFloorCollisionEnter = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody.getContainer().name == "Ball") {
        if (this.isFinal) MazeBall.game.finish();
        else this.swapControl();
      }
    }

    private addRigidBodies(): void {
      const node: f.Node = this.getContainer();

      node.getChildrenByName("Floor").forEach(floor => {
        console.log("test");
        const body: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE);
        body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onFloorCollisionEnter);
        floor.addComponent(body);
      });
      
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
      
      node.getChildrenByName("Cannon").forEach(cannon => {
        cannon.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
    }

    private swapControl(): void {
      if (MazeBall.playerControl.controlledPlatformTurntable != this.#turnTable) {
        MazeBall.playerControl.controlledPlatformTurntable = this.#turnTable;
      }
    }

  }
}