"use strict";
var MazeBall;
(function (MazeBall) {
    class ComponentPlatform extends MazeBall.ComponentScript {
        constructor() {
            super(...arguments);
            this.onCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    MazeBall.controlledPlatform = this.getContainer().mtxLocal;
            };
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
        }
    }
    MazeBall.ComponentPlatform = ComponentPlatform;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=ComponentPlatform.js.map