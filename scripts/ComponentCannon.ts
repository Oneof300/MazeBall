namespace MazeBallScripts {
  export class ComponentCannon extends ComponentScript {

    #projectile: MazeBall.Projectile;
    
    private triggerOffset: f.Vector3;
    private triggerSize: f.Vector3;

    constructor(_triggerOffset: f.Vector3 = f.Vector3.ZERO(), _triggerSize: f.Vector3 = f.Vector3.ONE()) {
      super();
      this.singleton = true;
      this.triggerOffset = _triggerOffset;
      this.triggerSize = _triggerSize;
    }

    protected onAdded(_event: Event): void {
      const trigger: f.Node = new MazeBall.Trigger(this.triggerOffset, this.triggerSize);
      trigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);

      this.#projectile = new MazeBall.Projectile();
      
      this.getContainer().addChild(trigger);
      this.getContainer().addChild(this.#projectile);
    }

    private onTriggerEnter = (_event: f.EventPhysics) => {
      const other: f.Node = _event.cmpRigidbody.getContainer();
      if (_event.cmpRigidbody.getContainer().name == "Ball") this.fire(other);
    }

    private fire(_target: f.Node): void {
      console.log("fire");

      // calculate start position and force for the projectile to fire
      const node: f.Node = this.getContainer();
      const cannonPos: f.Vector3 = node.mtxWorld.translation;
      const forward: f.Vector3 = node.mtxWorld.getZ();
      const distanceToTarget: number = f.Vector3.DIFFERENCE(cannonPos, _target.mtxWorld.translation).magnitude;
      const projectileStartPos: f.Vector3 = f.Vector3.SUM(cannonPos, f.Vector3.SCALE(forward, 2));
      const force: f.Vector3 = f.Vector3.SCALE(forward, distanceToTarget * MazeBall.gameSettings.cannonStrength);
      
      this.#projectile.fire(projectileStartPos, force);
    }

  }
}