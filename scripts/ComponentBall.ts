namespace MazeBallScripts {  
  export class ComponentBall extends ComponentScript {

    #body: f.ComponentRigidbody;
    #audioBallHit: f.ComponentAudio;

    private resetHeight: number;

    constructor(_resetHight: number = -1) {
      super();
      this.resetHeight = _resetHight;
    }

    protected onAdded(_event: Event): void {
      this.#body = this.node.getComponent(f.ComponentRigidbody);
      if (!this.#body) {
        this.#body = new f.ComponentRigidbody(MazeBall.gameSettings.ballMass, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE);
        this.node.addComponent(this.#body);
      }

      this.#audioBallHit = this.node.getComponent(f.ComponentAudio);
      if (!this.#audioBallHit) {
        const audio: f.Audio = MazeBall.getResourceByName("AudioBallHit") as f.Audio;
        if (audio) {
          this.#audioBallHit = new f.ComponentAudio(audio);
          this.node.addComponent(this.#audioBallHit);
        }
      }

      this.#body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollisionEnter);
      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    private onGameReset = (_event: Event) => {
      this.#body.setVelocity(f.Vector3.ZERO());
      this.#body.setAngularVelocity(f.Vector3.ZERO());
      this.#body.setPosition(f.Vector3.Y(1));
    }

    private onCollisionEnter = (_event: f.EventPhysics) => {
      if (this.#audioBallHit) {
        this.#audioBallHit.volume = this.#body.getVelocity().magnitude * 0.25;
        this.#audioBallHit.play(true);
      }
    }

    private update = (_event: Event) => {
      if (this.#body.getPosition().y < this.resetHeight) MazeBall.game.reset();
    }

  }
}