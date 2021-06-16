namespace MazeBall {

  export let canvas: HTMLCanvasElement;

  let viewport: f.Viewport;

  window.addEventListener("load", init);

  async function init(): Promise<void> {
    canvas = document.querySelector("canvas");
    f.Physics.initializePhysics();

    // load game settings
    const response: Response = await fetch("./../resources/GameSettings.json");
    gameSettings = await response.json();
    f.Physics.settings.debugMode = gameSettings.debugMode;
    f.Physics.settings.debugDraw = gameSettings.debugDraw;

    // load scene
    await f.Project.loadResources("./../resources/Scene.json");
    const scene: f.Graph = f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"] as f.Graph;
    f.Debug.log("Scene:", scene);

    // setup player control
    scene.addChild(playerControl);
    playerControl.viewObject = scene.getChildrenByName("Ball")[0];
    playerControl.startPlatformTurntable = scene.getChildrenByName("TurnTable")[0] as TurnTable;
    console.log(playerControl.startPlatformTurntable);

    // setup viewport
    viewport = new f.Viewport();
    viewport.initialize("Viewport", scene, playerControl.camera, canvas);
    f.Debug.log("Viewport:", viewport);

    // setup audio
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