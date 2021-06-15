namespace MazeBallScripts {
  export class ComponentCannon extends ComponentScript {

    private trigger: Trigger;
    private projectile: Projectile;

    constructor(_triggerOffset: f.Vector3, _triggerSize: f.Vector3) {
      super();
      this.singleton = true;

      this.trigger = new Trigger(_triggerOffset, _triggerSize);
      this.trigger.box.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);

      this.projectile = new Projectile();
    }

    protected onAdded(_event: Event): void {
      this.getContainer().addChild(this.trigger);
      this.getContainer().addChild(this.projectile);
    }

    private onTriggerEnter = (_event: f.EventPhysics) => {
      const other: f.Node = _event.cmpRigidbody.getContainer();
      if (other.name == "Ball") this.fire(other);
    }

    private fire(_target: f.Node): void {
      console.log("fire");
      const mtxWorld: f.Matrix4x4 = this.getContainer().mtxWorld;
      const distanceToTarget: number = f.Vector3.DIFFERENCE(mtxWorld.translation, _target.mtxWorld.translation).magnitude;
      this.projectile.fire(f.Vector3.SUM(mtxWorld.translation, f.Vector3.SCALE(mtxWorld.getZ(), 2)),
                           f.Vector3.SCALE(mtxWorld.getZ(), mb.gameSettings.cannonStrength * distanceToTarget));
    }

  }
}