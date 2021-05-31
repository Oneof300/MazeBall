"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    class ComponentScript extends PuzzleGame.f.ComponentScript {
        constructor() {
            super();
            if (this.onAdded != undefined)
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, (event) => {
                    if (event.target == this)
                        this.onAdded(event);
                });
        }
    }
    PuzzleGame.ComponentScript = ComponentScript;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=ComponentScript.js.map