namespace MazeBallScripts {
  export class ComponentCannon extends ComponentScript {

    #projectile: MazeBall.Projectile;
    #ball: f.Matrix4x4;
    #ballWasInSight: boolean = false;

    private range: number;

    constructor(_range: number = 1) {
      super();
      this.singleton = true;
      this.range = _range;
    }

    private get ball(): f.Matrix4x4 {
      if (!this.#ball) this.#ball = this.node.getAncestor().getChildrenByName("Ball")[0].mtxWorld;
      return this.#ball;
    }

    protected onAdded(_event: Event): void {
      this.#projectile = new MazeBall.Projectile(this.node.getComponent(f.ComponentMaterial).material);
      this.node.addChild(this.#projectile);

      // Lazy Pattern everywhere?

      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, this.onGameStart);
      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.END, this.onGameEnd);
    }

    private onGameStart = (_event: Event) => {
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private onGameEnd = (_event: Event) => {
      f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private update = (_event: Event) => {
      const mtxWorld: f.Matrix4x4 = this.node.mtxWorld;
      const differenceToBall: f.Vector3 = f.Vector3.DIFFERENCE(mtxWorld.translation, this.ball.translation);
      const forward: f.Vector3 = mtxWorld.getZ();
      const ballInSight: boolean
        = differenceToBall.magnitude < this.range && f.Vector3.DOT(f.Vector3.NORMALIZATION(differenceToBall), forward) < -0.975;
      
      if (ballInSight && !this.#ballWasInSight) this.fire();
      this.#ballWasInSight = ballInSight;
    }

    private fire(): void {
      console.log("fire");

      // calculate start position and force for the projectile to fire
      const cannonPos: f.Vector3 = this.node.mtxWorld.translation;
      const forward: f.Vector3 = this.node.mtxWorld.getZ();
      const distanceToTarget: number = f.Vector3.DIFFERENCE(cannonPos, this.ball.translation).magnitude;
      const projectileStartPos: f.Vector3 = f.Vector3.SUM(cannonPos, f.Vector3.SCALE(forward, 1));
      const force: f.Vector3 = f.Vector3.SCALE(forward, (10 - 10 / distanceToTarget) * MazeBall.gameSettings.cannonStrength);

      this.#projectile.fire(projectileStartPos, force);
    }

  }
}