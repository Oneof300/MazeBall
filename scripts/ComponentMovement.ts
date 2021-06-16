namespace MazeBallScripts {
  export class ComponentMovement extends ComponentScript {

    #startPos: f.Vector3;
    #dir: f.Vector3;
    #center: f.Vector3;
    #range: number;

    private movement: f.Vector3;
    private speed: number;
    private loop: boolean;
    
    constructor(_movement: f.Vector3 = f.Vector3.X(), _speed: number = 1, _loop: boolean = true) {
      super();
      this.singleton = true;
      this.movement = _movement;
      this.speed = _speed;
      this.loop = _loop;
    }

    start(): void {
      this.#center = f.Vector3.SUM(this.getContainer().mtxLocal.translation, f.Vector3.SCALE(this.movement, 0.5));
      this.#range = this.movement.magnitude / 2;
      this.#dir = f.Vector3.NORMALIZATION(this.movement);

      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    protected onAdded(_event: Event): void {
      this.#startPos = this.getContainer().mtxLocal.translation;
      MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
      if (this.loop) MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, () => this.start());
    }

    private onGameReset = (_event: Event) => {
      const mtxLocal: f.Matrix4x4 = this.getContainer().mtxLocal;
      mtxLocal.translate(f.Vector3.DIFFERENCE(this.#startPos, mtxLocal.translation));
    }

    private update = (_event: Event) => {
      const mtxLocal: f.Matrix4x4 = this.getContainer().mtxLocal;
      const movement: f.Vector3 = f.Vector3.SCALE(this.#dir, this.speed * f.Loop.timeFrameReal / 1000);
      const distanceToCenter: number = f.Vector3.DIFFERENCE(f.Vector3.SUM(mtxLocal.translation, movement), this.#center).magnitude;

      if (distanceToCenter > this.#range) {
        movement.scale(this.#range / distanceToCenter);
        if (this.loop) this.#dir.scale(-1);
        else f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
      }

      mtxLocal.translate(movement);
    }

  }
}