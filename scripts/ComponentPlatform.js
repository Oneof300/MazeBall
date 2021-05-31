"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    class ComponentPlatform extends PuzzleGame.ComponentScript {
        constructor() {
            super(...arguments);
            this.onTriggerEnter = (_event) => {
                console.log("Ball entered platform");
                PuzzleGame.controlledPlatforms.push(this.getContainer());
            };
            this.onTriggerExit = (_event) => {
                console.log("Ball exited platform");
                PuzzleGame.controlledPlatforms.splice(PuzzleGame.controlledPlatforms.indexOf(this.getContainer()));
            };
        }
        onAdded(_event) {
            let node = this.getContainer();
            let xPositions = node.getChildren().map(child => {
                let childMeshScaling = child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling;
                return child.mtxLocal.translation.x + childMeshScaling.x * child.mtxLocal.translation.x < 0 ? -1 : 1;
            });
            let zPositions = node.getChildren().map(child => {
                let childMeshScaling = child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling;
                return child.mtxLocal.translation.z + childMeshScaling.z * child.mtxLocal.translation.z < 0 ? -1 : 1;
            });
            let left = Math.min(...xPositions);
            let right = Math.max(...xPositions);
            let front = Math.min(...zPositions);
            let back = Math.max(...zPositions);
            let size = new PuzzleGame.f.Vector3(right - left, 20, back - front);
            let pos = new PuzzleGame.f.Vector3(left + size.x / 2, 0, front + size.z / 2);
            this.trigger = new PuzzleGame.Trigger(pos, size);
            this.trigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
            this.trigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerExit);
            node.getChildrenByName("Floor").forEach(floor => {
                floor.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE));
            });
        }
    }
    PuzzleGame.ComponentPlatform = ComponentPlatform;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=ComponentPlatform.js.map