///<reference path="ComponentScript.ts"/>
///<reference path="Game.ts"/>
namespace MazeBallScripts {  
  export class ComponentBall extends ComponentScript {

    protected onAdded(_event: Event): void {
      const node: f.Node = this.getContainer();

      const body: f.ComponentRigidbody
        = new f.ComponentRigidbody(MazeBall.gameSettings.ballMass, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE);
      body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollision);
      node.addComponent(body);

      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
    }

    private onGameReset = (_event: Event) => {
      const body: f.ComponentRigidbody = this.getContainer().getComponent(f.ComponentRigidbody);
      body.setVelocity(f.Vector3.ZERO());
      body.setAngularVelocity(f.Vector3.ZERO());
      body.setPosition(f.Vector3.Y(3));
    }

    private onCollision = (_event: f.EventPhysics) => {
      const audio: f.ComponentAudio = this.getContainer().getComponent(f.ComponentAudio);
      audio.volume = (_event.target as f.ComponentRigidbody).getVelocity().magnitude;
      audio.play(true);
    }

  }
}