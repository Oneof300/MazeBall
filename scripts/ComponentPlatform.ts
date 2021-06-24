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
      this.node.addEventListener(f.EVENT.CHILD_APPEND, this.onChildAppend);
    }

    private onChildAppend = (_event: Event) => {
      if (_event.currentTarget == _event.target) {
        // this components node has been appended
        this.node.removeEventListener(f.EVENT.CHILD_APPEND, this.onChildAppend);

        if (!this.isFinal) {
          // Append turn table
          this.#turnTable = new MazeBall.TurnTable();
          this.node.getParent().addChild(this.#turnTable);
          this.#turnTable.mtxLocal.translate(this.node.mtxLocal.translation);
          this.node.mtxLocal.set(f.Matrix4x4.ROTATION(this.node.mtxLocal.rotation));
          this.#turnTable.addChild(this.node);
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
      
      this.node.getChildren().forEach(child => {
        let body: f.ComponentRigidbody = child.getComponent(f.ComponentRigidbody);
        if (!body) {
          body = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE);
          child.addComponent(body);
        }
        if (child.name == "Floor") body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onFloorCollisionEnter);
      });
    }

    private swapControl(): void {
      MazeBall.playerControl.controlledPlatformTurntable = this.#turnTable;
    }

  }
}