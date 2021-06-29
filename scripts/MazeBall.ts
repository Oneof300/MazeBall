namespace MazeBall {

  let viewport: f.Viewport;

  window.addEventListener("load", init);

  async function init(): Promise<void> {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    f.Physics.initializePhysics();

    // load game settings
    const response: Response = await fetch("./resources/GameSettings.json");
    gameSettings = await response.json();
    f.Physics.settings.debugMode = gameSettings.debugMode;
    f.Physics.settings.debugDraw = gameSettings.debugDraw;

    // load scene
    await f.Project.loadResources("./resources/Scene.json");
    const scene: f.Graph = getResourceByName("Scene") as f.Graph;
    f.Debug.log("Scene:", scene);

    // setup player control
    playerControl.viewObject = scene.getChildrenByName("Ball")[0];
    scene.addChild(playerControl);

    // setup scroll to rotate message
    const message: HTMLElement = document.getElementById("message");

    function onWheel(): void {
      window.removeEventListener("wheel", onWheel);
      message.hidden = true;
    }

    (scene.getChildrenByName("TurnTable")[1] as TurnTable)
    .getChild(0)
    .getComponent(MazeBallScripts.ComponentPlatform)
    .addEventListener("ballenter", () => {
      message.innerText = "scroll to rotate";
      message.hidden = false;
      window.addEventListener("wheel", onWheel);
    });

    // setup viewport
    viewport = new f.Viewport();
    viewport.initialize("Viewport", scene, playerControl.camera, canvas);
    f.Debug.log("Viewport:", viewport);

    // setup audio
    let cmpListener: f.ComponentAudioListener = new f.ComponentAudioListener();
    playerControl.addComponent(cmpListener);
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

  export function getResourceByName(_name: string): f.SerializableResource {
    for (const resourceID in f.Project.resources) {
      if (f.Project.resources[resourceID].name == _name) return f.Project.resources[resourceID];
    }
    return null;
  }

}