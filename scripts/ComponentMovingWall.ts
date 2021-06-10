namespace MazeBall {
  export class ComponentMovingWall extends ComponentScript {

    private readonly vel: number;
    private readonly range: number;
    private readonly dir: f.Vector3;
    private origin: f.Vector3;
    
    constructor(_vel: number, _range: number, _dir: f.Vector3) {
      super();
      this.vel = _vel;
      this.range = _range;
      this.dir = _dir;
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    protected onAdded(_event: Event): void {
      this.origin = this.getContainer().mtxLocal.translation;
    }

    private update = (_event: Event) => {
      const mtxLocal: f.Matrix4x4 = this.getContainer().mtxLocal;
      const movement: f.Vector3 = f.Vector3.SCALE(this.dir, this.vel * f.Loop.timeFrameReal / 1000);
      const newDistance: number = f.Vector3.DIFFERENCE(f.Vector3.SUM(mtxLocal.translation, movement), this.origin).magnitude;

      if (newDistance > this.range) {
        movement.scale(this.range / newDistance);
        this.dir.scale(-1);
      }

      mtxLocal.translate(movement);
    }

  }
}