"use strict";
var MazeBall;
(function (MazeBall) {
    MazeBall.f = FudgeCore;
    let viewport;
    let canvas;
    let scene;
    window.addEventListener("load", init);
    async function init() {
        canvas = document.querySelector("canvas");
        // load resources referenced in the link-tag
        await MazeBall.f.Project.loadResources("./resources/Scene.json");
        MazeBall.f.Debug.log("Project:", MazeBall.f.Project.resources);
        // initialize physics
        MazeBall.f.Physics.initializePhysics();
        MazeBall.f.Physics.settings.debugMode = MazeBall.f.PHYSICS_DEBUGMODE.COLLIDERS;
        MazeBall.f.Physics.settings.debugDraw = true;
        // setup graph
        scene = MazeBall.f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"];
        scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new MazeBall.ComponentPlatform()));
        scene.getChildrenByName("Ball")[0].addComponent(new MazeBall.ComponentBall());
        MazeBall.f.Debug.log("Scene:", scene);
        // setup camera
        let camera = new MazeBall.f.ComponentCamera();
        camera.mtxPivot.translateX(10);
        camera.mtxPivot.translateY(25);
        camera.mtxPivot.translateZ(28);
        camera.mtxPivot.rotateY(180);
        camera.mtxPivot.rotateX(45);
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", scene, camera, canvas);
        MazeBall.f.Debug.log("Viewport:", viewport);
        // setup audio
        scene.addComponent(MazeBall.ComponentPlatform.swapControlAudio);
        let cmpListener = new MazeBall.f.ComponentAudioListener();
        scene.addComponent(cmpListener);
        MazeBall.f.AudioManager.default.listenWith(cmpListener);
        MazeBall.f.AudioManager.default.listenTo(scene);
        MazeBall.f.Debug.log("Audio:", MazeBall.f.AudioManager.default);
        // setup controll
        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
            canvas.addEventListener("mousemove", handleMouse);
            canvas.addEventListener("wheel", handleWheel);
        });
        // start game
        MazeBall.f.Physics.adjustTransforms(scene, true);
        viewport.draw();
        MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, 120);
    }
    function update() {
        MazeBall.f.Physics.world.simulate(MazeBall.f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
    function handleMouse(_event) {
        MazeBall.controlledPlatform.rotateX(_event.movementY * 0.05);
        MazeBall.controlledPlatform.rotateZ(_event.movementX * -0.05);
    }
    function handleWheel(_event) {
        MazeBall.controlledPlatform.rotateY(_event.deltaY * 0.05);
    }
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=MazeBall.js.map