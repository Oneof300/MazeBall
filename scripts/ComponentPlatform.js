"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    class ComponentPlatform extends PuzzleGame.ComponentScript {
        constructor() {
            super(...arguments);
            this.triggers = new Array();
            this.onTriggerEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball"
                    && !this.triggers.some(trigger => trigger != _event.target && trigger.bodiesInTrigger.includes(_event.cmpRigidbody))) {
                    this.onBallEnteredPlatform(_event);
                }
            };
            this.onTriggerExit = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball"
                    && !this.triggers.some(trigger => trigger.bodiesInTrigger.includes(_event.cmpRigidbody))) {
                    this.onBallExitedPlatform(_event);
                }
            };
        }
        onAdded(_event) {
            let node = this.getContainer();
            node.getChildrenByName("Floor").forEach(floor => {
                let triggerNode = new PuzzleGame.f.Node("Trigger");
                let floorMeshScaling = floor.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling;
                triggerNode.addComponent(new PuzzleGame.f.ComponentTransform());
                triggerNode.mtxLocal.translate(floor.mtxLocal.translation);
                triggerNode.mtxLocal.scale(new PuzzleGame.f.Vector3(floorMeshScaling.x, 20, floorMeshScaling.z));
                let triggerBody = new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.STATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE, PuzzleGame.f.PHYSICS_GROUP.TRIGGER);
                triggerBody.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
                triggerBody.addEventListener("TriggerLeftCollision" /* TRIGGER_EXIT */, this.onTriggerExit);
                triggerNode.addComponent(triggerBody);
                this.triggers.push(triggerBody);
                PuzzleGame.scene.addChild(triggerNode);
                floor.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE));
            });
        }
        onBallEnteredPlatform(_event) {
            console.log("Ball entered platform");
            PuzzleGame.controlledPlatforms.push(this.getContainer());
        }
        onBallExitedPlatform(_event) {
            console.log("Ball exited platform");
            PuzzleGame.controlledPlatforms.splice(PuzzleGame.controlledPlatforms.indexOf(this.getContainer()));
        }
    }
    PuzzleGame.ComponentPlatform = ComponentPlatform;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=ComponentPlatform.js.map