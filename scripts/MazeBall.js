"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let viewport;
    let floor;
    let canvas;
    async function init() {
        canvas = document.querySelector("canvas");
        // load resources referenced in the link-tag
        await f.Project.loadResources("../resources/MazeBall.json");
        f.Debug.log("Project:", f.Project.resources);
        // load start scene
        let sceneID = "Graph|2021-05-25T15:28:57.816Z|73244";
        let scene = f.Project.resources[sceneID];
        // initialize physics
        f.Physics.initializePhysics();
        f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.debugDraw = true;
        // setup graph
        floor = scene.getChildrenByName("Floor")[0];
        floor.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
        floor.addComponent(new f.ComponentTransform());
        scene.getChildrenByName("Ball")[0].addComponent(new f.ComponentRigidbody(20, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE));
        f.Debug.log("Scene:", scene);
        f.Physics.adjustTransforms(scene, true);
        // setup camera
        let camera = new f.ComponentCamera();
        camera.mtxPivot.translateX(-28);
        camera.mtxPivot.translateY(25);
        camera.mtxPivot.rotateY(90);
        camera.mtxPivot.rotateX(45);
        // setup viewport
        viewport = new f.Viewport();
        viewport.initialize("Viewport", scene, camera, canvas);
        f.Debug.log("Viewport:", viewport);
        // setup audio
        let cmpListener = new f.ComponentAudioListener();
        scene.addComponent(cmpListener);
        f.AudioManager.default.listenWith(cmpListener);
        f.AudioManager.default.listenTo(scene);
        f.Debug.log("Audio:", f.AudioManager.default);
        // setup controll
        canvas.addEventListener("mousemove", handleMouse);
        // start game
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update() {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
    function handleMouse(_event) {
        floor.mtxLocal.rotateZ(_event.movementY / 50);
        floor.mtxLocal.rotateX(_event.movementX / 50);
    }
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=MazeBall.js.map