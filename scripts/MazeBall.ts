namespace MazeBall {
  export import f = FudgeCore;

  window.addEventListener("load", init);

  let viewport: f.Viewport;
  let canvas: HTMLCanvasElement;

  export let scene: f.Graph;
  export let controlledPlatform: f.Matrix4x4;

  async function init(): Promise<void> {
    canvas = document.querySelector("canvas");

    // load resources referenced in the link-tag
    await f.Project.loadResources("../static/MazeBall.json");
    f.Debug.log("Project:", f.Project.resources);

    // load start scene
    let sceneID: string = "Graph|2021-05-25T15:28:57.816Z|73244";
    scene = f.Project.resources[sceneID] as f.Graph;

    // initialize physics
    f.Physics.initializePhysics();
    f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
    f.Physics.settings.debugDraw = true;

    // setup graph
    scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new ComponentPlatform()));

    scene.getChildrenByName("Ball")[0].addComponent(new f.ComponentRigidbody(20, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE));

    f.Debug.log("Scene:", scene);
    f.Physics.adjustTransforms(scene, true);

    // setup camera
    let camera: f.ComponentCamera = new f.ComponentCamera();
    camera.mtxPivot.translateX(10);
    camera.mtxPivot.translateY(25);
    camera.mtxPivot.translateZ(28);
    camera.mtxPivot.rotateY(180);
    camera.mtxPivot.rotateX(45);

    // setup viewport
    viewport = new f.Viewport();
    viewport.initialize("Viewport", scene, camera, canvas);
    f.Debug.log("Viewport:", viewport);

    // setup audio
    let cmpListener: f.ComponentAudioListener = new f.ComponentAudioListener();
    scene.addComponent(cmpListener);
    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(scene);
    f.Debug.log("Audio:", f.AudioManager.default);

    // setup controll
    canvas.addEventListener("click", () => {
      canvas.requestPointerLock();
      canvas.addEventListener("mousemove", handleMouse);
      canvas.addEventListener("wheel", handleWheel);
    });

    // start game
    viewport.draw();
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 120);
  }

  function update(): void {
    f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
    viewport.draw();
  }

  function handleMouse(_event: MouseEvent): void {
    controlledPlatform.rotateX(_event.movementY * 0.05);
    controlledPlatform.rotateZ(_event.movementX * -0.05);
  }

  function handleWheel(_event: WheelEvent) {
    controlledPlatform.rotateY(_event.deltaY * 0.05);
  }
}