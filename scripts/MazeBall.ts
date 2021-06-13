namespace MazeBall {  

  export let canvas: HTMLCanvasElement;
  export let scene: f.Graph;

  let viewport: f.Viewport;

  window.addEventListener("load", init);

  async function init(): Promise<void> {
    canvas = document.querySelector("canvas");

    // load resources referenced in the link-tag
    await f.Project.loadResourcesFromHTML();
    f.Debug.log("Project:", f.Project.resources);

    // load game settings
    let response: Response = await fetch("./../resources/GameSettings.json");
    gameSettings = await response.json();

    // initialize physics
    f.Physics.initializePhysics();
    f.Physics.settings.debugMode = (<any>f.PHYSICS_DEBUGMODE)[gameSettings.debugMode];
    f.Physics.settings.debugDraw = gameSettings.debugDraw;

    // setup graph
    scene = f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"] as f.Graph;
    scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new ComponentPlatform()));
    scene.getChildrenByName("FinalPlatform")[0].addComponent(new ComponentPlatform(true));
    scene.getChildrenByName("Ball")[0].addComponent(new ComponentBall());

    //scene.getChildrenByName("Platform")[1].getChildrenByName("Wall")[0].addComponent(new ComponentMovingWall(5, 5, f.Vector3.X()));
    f.Debug.log("Scene:", scene);

    // setup player control
    scene.addChild(playerControl);
    playerControl.viewObject = scene.getChildrenByName("Ball")[0];

    // setup viewport
    viewport = new f.Viewport();
    viewport.initialize("Viewport", scene, playerControl.camera, canvas);
    f.Debug.log("Viewport:", viewport);

    // setup audio
    scene.addComponent(ComponentPlatform.swapControlAudio);
    let cmpListener: f.ComponentAudioListener = new f.ComponentAudioListener();
    scene.addComponent(cmpListener);
    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(scene);
    f.Debug.log("Audio:", f.AudioManager.default);

    // start
    f.Physics.adjustTransforms(scene, true);
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, gameSettings.fps);
    viewport.draw();
    
    game.requestClickToStart();
  }

  function update(): void {
    f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
    viewport.draw();
  }

}