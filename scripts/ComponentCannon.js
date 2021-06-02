"use strict";
var MazeBall;
(function (MazeBall) {
    class ComponentCannon extends MazeBall.ComponentScript {
        constructor(_triggerOffset, _triggerSize) {
            super();
            this.strength = 100;
            this.onTriggerEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    this.fire();
            };
            this.singleton = true;
            this.trigger = new MazeBall.Trigger(_triggerOffset, _triggerSize);
            this.trigger.box.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
            this.projectile = new MazeBall.Projectile();
        }
        onAdded(_event) {
            this.getContainer().addChild(this.trigger);
            this.getContainer().addChild(this.projectile);
        }
        fire() {
            console.log("fire");
            const mtxLocal = this.getContainer().mtxLocal;
            this.projectile.fire(mtxLocal.translation, MazeBall.f.Vector3.SCALE(mtxLocal.getZ(), this.strength));
        }
    }
    MazeBall.ComponentCannon = ComponentCannon;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=ComponentCannon.js.map