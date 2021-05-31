"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    PuzzleGame.f = FudgeCore;
    window.addEventListener("load", init);
    let viewport;
    let canvas;
    async function init() {
        canvas = document.querySelector("canvas");
        // load resources referenced in the link-tag
        await PuzzleGame.f.Project.loadResources("../static/MazeBall.json");
        PuzzleGame.f.Debug.log("Project:", PuzzleGame.f.Project.resources);
        // load start scene
        let sceneID = "Graph|2021-05-25T15:28:57.816Z|73244";
        PuzzleGame.scene = PuzzleGame.f.Project.resources[sceneID];
        // initialize physics
        PuzzleGame.f.Physics.initializePhysics();
        PuzzleGame.f.Physics.settings.debugMode = PuzzleGame.f.PHYSICS_DEBUGMODE.COLLIDERS;
        PuzzleGame.f.Physics.settings.debugDraw = true;
        // setup graph
        PuzzleGame.scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new PuzzleGame.ComponentPlatform()));
        PuzzleGame.scene.getChildrenByName("Ball")[0].addComponent(new PuzzleGame.f.ComponentRigidbody(20, PuzzleGame.f.PHYSICS_TYPE.DYNAMIC, PuzzleGame.f.COLLIDER_TYPE.SPHERE));
        PuzzleGame.f.Debug.log("Scene:", PuzzleGame.scene);
        PuzzleGame.f.Physics.adjustTransforms(PuzzleGame.scene, true);
        // setup camera
        let camera = new PuzzleGame.f.ComponentCamera();
        camera.mtxPivot.translateX(10);
        camera.mtxPivot.translateY(25);
        camera.mtxPivot.translateZ(28);
        camera.mtxPivot.rotateY(180);
        camera.mtxPivot.rotateX(45);
        // setup viewport
        viewport = new PuzzleGame.f.Viewport();
        viewport.initialize("Viewport", PuzzleGame.scene, camera, canvas);
        PuzzleGame.f.Debug.log("Viewport:", viewport);
        // setup audio
        let cmpListener = new PuzzleGame.f.ComponentAudioListener();
        PuzzleGame.scene.addComponent(cmpListener);
        PuzzleGame.f.AudioManager.default.listenWith(cmpListener);
        PuzzleGame.f.AudioManager.default.listenTo(PuzzleGame.scene);
        PuzzleGame.f.Debug.log("Audio:", PuzzleGame.f.AudioManager.default);
        // setup controll
        canvas.addEventListener("mousemove", handleMouse);
        // start game
        viewport.draw();
        PuzzleGame.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        PuzzleGame.f.Loop.start();
    }
    function update() {
        PuzzleGame.f.Physics.world.simulate(PuzzleGame.f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
    function handleMouse(_event) {
        PuzzleGame.controlledPlatform.mtxLocal.rotateX(_event.movementY / 50);
        PuzzleGame.controlledPlatform.mtxLocal.rotateZ(-_event.movementX / 50);
    }
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=MazeBall.js.map