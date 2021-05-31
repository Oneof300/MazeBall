"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    class Trigger extends PuzzleGame.f.Node {
        constructor(_pos, _size) {
            super("Trigger");
            this.addComponent(new PuzzleGame.f.ComponentTransform());
            this.mtxLocal.translate(_pos);
            this.mtxLocal.scale(_size);
            this.box = new PuzzleGame.f.ComponentRigidbody(0, PuzzleGame.f.PHYSICS_TYPE.STATIC, PuzzleGame.f.COLLIDER_TYPE.CUBE, PuzzleGame.f.PHYSICS_GROUP.TRIGGER);
            this.addComponent(this.box);
        }
    }
    PuzzleGame.Trigger = Trigger;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=Trigger.js.map