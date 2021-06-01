"use strict";
var MazeBall;
(function (MazeBall) {
    class ComponentScript extends MazeBall.f.ComponentScript {
        constructor() {
            super();
            if (this.onAdded != undefined)
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, (event) => {
                    if (event.target == this)
                        this.onAdded(event);
                });
        }
    }
    MazeBall.ComponentScript = ComponentScript;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=ComponentScript.js.map