namespace PuzzleGame {
  export class ComponentPlatform extends ComponentScript {

    private trigger: Trigger;

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      let xPositions: number[] = node.getChildren().map(child => {
        let childMeshScaling: f.Vector3 = child.getComponent(f.ComponentMesh).mtxPivot.scaling;
        return child.mtxLocal.translation.x + childMeshScaling.x * child.mtxLocal.translation.x < 0 ? -1 : 1;
      });
      let zPositions: number[] = node.getChildren().map(child => {
        let childMeshScaling: f.Vector3 = child.getComponent(f.ComponentMesh).mtxPivot.scaling;
        return child.mtxLocal.translation.z + childMeshScaling.z * child.mtxLocal.translation.z < 0 ? -1 : 1;
      });

      let left: number = Math.min(...xPositions);
      let right: number = Math.max(...xPositions);
      let front: number = Math.min(...zPositions);
      let back: number = Math.max(...zPositions);

      let size: f.Vector3 = new f.Vector3(right - left, 20, back - front);
      let pos: f.Vector3 = new f.Vector3(left + size.x / 2, 0, front + size.z / 2);

      this.trigger = new Trigger(pos, size);
      this.trigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);
      this.trigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerExit);

      node.getChildrenByName("Floor").forEach(floor => {
        floor.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
      
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
    }

    private onTriggerEnter = (_event: f.EventPhysics): void => {
      console.log("Ball entered platform");
      controlledPlatforms.push(this.getContainer());
    }

    private onTriggerExit = (_event: f.EventPhysics): void => {
      console.log("Ball exited platform");
      controlledPlatforms.splice(controlledPlatforms.indexOf(this.getContainer()));
    }

  }
}