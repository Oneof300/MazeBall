namespace MazeBallScripts {  
  export class ComponentBall extends ComponentScript {

    #body: f.ComponentRigidbody;
    #audioBallHit: f.ComponentAudio;

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

      this.#body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollision);
      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
    }

    private onGameReset = (_event: Event) => {
      this.#body.setVelocity(f.Vector3.ZERO());
      this.#body.setAngularVelocity(f.Vector3.ZERO());
      this.#body.setPosition(f.Vector3.Y(3));
    }

    private onCollision = (_event: f.EventPhysics) => {
      if (this.#audioBallHit) {
        this.#audioBallHit.volume = this.#body.getVelocity().magnitude * 0.25;
        this.#audioBallHit.play(true);
      }
    }

  }
}