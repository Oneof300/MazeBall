///<reference path="ComponentScript.ts"/>
///<reference path="Game.ts"/>
namespace MazeBallScripts {

  export import mb = MazeBall;
  
  export class ComponentBall extends ComponentScript {

    private static ballHitAudio: f.Audio = new f.Audio("./resources/sounds/ball_hit.mp3");
    private ballHitAudio: f.ComponentAudio;

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      this.ballHitAudio = new f.ComponentAudio(ComponentBall.ballHitAudio);
      node.addComponent(this.ballHitAudio);

      let body: f.ComponentRigidbody = new f.ComponentRigidbody(mb.gameSettings.ballMass, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE);
      body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollision);
      node.addComponent(body);

      mb.game.addEventListener(mb.EVENT_GAME.RESET, this.onGameReset);
    }

    private onGameReset = (_event: Event) => {
      let body: f.ComponentRigidbody = this.getContainer().getComponent(f.ComponentRigidbody);
      body.setVelocity(f.Vector3.ZERO());
      body.setAngularVelocity(f.Vector3.ZERO());
      body.setPosition(f.Vector3.Y(3));
    }

    private onCollision = (_event: f.EventPhysics) => {
      this.ballHitAudio.volume = (_event.target as f.ComponentRigidbody).getVelocity().magnitude;
      this.ballHitAudio.play(true);
    }

  }
}