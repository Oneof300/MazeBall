"use strict";
var MazeBall;
(function (MazeBall) {
    class Projectile extends MazeBall.f.Node {
        constructor() {
            super("Projectile");
            let cmpMesh = new MazeBall.f.ComponentMesh(MazeBall.f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"]);
            cmpMesh.mtxPivot.scale(MazeBall.f.Vector3.ONE(0.5));
            this.addComponent(cmpMesh);
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.body = new MazeBall.f.ComponentRigidbody(20, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.SPHERE, MazeBall.f.PHYSICS_GROUP.TRIGGER);
            this.addComponent(this.body);
            this.activate(false);
        }
        fire(_pos, _force) {
            this.mtxLocal.translate(MazeBall.f.Vector3.DIFFERENCE(_pos, this.mtxLocal.translation));
            this.activate(true);
            this.body.physicsType = MazeBall.f.PHYSICS_TYPE.DYNAMIC;
            this.body.applyForce(_force);
        }
    }
    MazeBall.Projectile = Projectile;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=Projectile.js.map