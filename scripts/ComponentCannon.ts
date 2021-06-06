namespace MazeBall {
  export class ComponentCannon extends ComponentScript {

    readonly strength: number = 100;

    private trigger: Trigger;
    private projectile: Projectile;

    constructor(_triggerOffset: f.Vector3, _triggerSize: f.Vector3) {
      super();
      this.singleton = true;

      this.trigger = new Trigger(_triggerOffset, _triggerSize);
      this.trigger.box.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);

      this.projectile = new Projectile();
    }

    onAdded(_event: Event): void {
      this.getContainer().addChild(this.trigger);
      this.getContainer().addChild(this.projectile);
    }

    private onTriggerEnter = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody.getContainer().name == "Ball") this.fire();
    }

    private fire(): void {
      console.log("fire");
      const mtxLocal: f.Matrix4x4 = this.getContainer().mtxLocal;
      this.projectile.fire(mtxLocal.translation, f.Vector3.SCALE(mtxLocal.getZ(), this.strength));
    }

  }
}