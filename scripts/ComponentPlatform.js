"use strict";
var MazeBall;
(function (MazeBall) {
    class ComponentPlatform extends MazeBall.ComponentScript {
        constructor() {
            super();
            this.onCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    this.swapControl();
            };
            this.singleton = true;
        }
        onAdded(_event) {
            let node = this.getContainer();
            node.getChildrenByName("Floor").forEach(floor => {
                let body = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE);
                body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollisionEnter);
                floor.addComponent(body);
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Cannon").forEach(cannon => {
                cannon.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
                cannon.addComponent(new MazeBall.ComponentCannon(MazeBall.f.Vector3.Z(6), new MazeBall.f.Vector3(5, 10, 5)));
            });
        }
        swapControl() {
            if (MazeBall.controlledPlatform != this.getContainer().mtxLocal) {
                MazeBall.controlledPlatform = this.getContainer().mtxLocal;
                ComponentPlatform.swapControlAudio.play(true);
            }
        }
    }
    ComponentPlatform.swapControlAudio = new MazeBall.f.ComponentAudio(new MazeBall.f.Audio("../resources/sounds/control_swap.mp3"));
    MazeBall.ComponentPlatform = ComponentPlatform;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=ComponentPlatform.js.map