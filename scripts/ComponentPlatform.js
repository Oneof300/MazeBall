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
            this.initializeTrigger(node);
            node.getChildrenByName("Floor").forEach(floor => floor.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE)));
            node.getChildrenByName("Wall").forEach(wall => wall.addComponent(new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.KINEMATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE)));
        }
        initializeTrigger(node) {
            let left = Math.min(...node.getChildren().map(child => child.mtxLocal.translation.x - child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling.x / 2));
            let right = Math.max(...node.getChildren().map(child => child.mtxLocal.translation.x + child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling.x / 2));
            let front = Math.min(...node.getChildren().map(child => child.mtxLocal.translation.z - child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling.z / 2));
            let back = Math.max(...node.getChildren().map(child => child.mtxLocal.translation.z + child.getComponent(PuzzleGame.f.ComponentMesh).mtxPivot.scaling.z / 2));
            let size = new PuzzleGame.f.Vector3(right - left, 20, back - front);
            let pos = new PuzzleGame.f.Vector3(left + size.x / 2, 0, front + size.z / 2);
            this.trigger = new PuzzleGame.Trigger(pos, size);
            this.trigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
            this.trigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerExit);
            node.addChild(this.trigger);
        }
    }
    PuzzleGame.ComponentPlatform = ComponentPlatform;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=ComponentPlatform.js.map