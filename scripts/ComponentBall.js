"use strict";
var MazeBall;
(function (MazeBall) {
    class ComponentBall extends MazeBall.ComponentScript {
        constructor() {
            super(...arguments);
            this.onCollision = (_event) => {
                this.ballHitAudio.volume = _event.target.getVelocity().magnitude;
                this.ballHitAudio.play(true);
            };
        }
        onAdded(_event) {
            let node = this.getContainer();
            this.ballHitAudio = new MazeBall.f.ComponentAudio(ComponentBall.ballHitAudio);
            node.addComponent(this.ballHitAudio);
            let body = new MazeBall.f.ComponentRigidbody(20, MazeBall.f.PHYSICS_TYPE.DYNAMIC, MazeBall.f.COLLIDER_TYPE.SPHERE);
            body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
            node.addComponent(body);
        }
    }
    ComponentBall.ballHitAudio = new MazeBall.f.Audio("../resources/sounds/ball_hit.mp3");
    MazeBall.ComponentBall = ComponentBall;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=ComponentBall.js.map