"use strict";
var MazeBall;
(function (MazeBall) {
    class Trigger extends MazeBall.f.Node {
        constructor(_pos, _size) {
            super("Trigger");
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.mtxLocal.translate(_pos);
            this.mtxLocal.scale(_size);
            this.box = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.CUBE, MazeBall.f.PHYSICS_GROUP.TRIGGER);
            this.addComponent(this.box);
        }
    }
    MazeBall.Trigger = Trigger;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=Trigger.js.map