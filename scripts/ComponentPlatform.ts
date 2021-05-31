namespace PuzzleGame {
  export class ComponentPlatform extends ComponentScript {

    private trigger: Trigger;

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      this.initializeTrigger(node);

      node.getChildrenByName("Floor").forEach(floor => 
        floor.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE)));
      
      node.getChildrenByName("Wall").forEach(wall =>
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE)));
    }

    private onTriggerEnter = (_event: f.EventPhysics) => {
      console.log("Ball entered platform");
      controlledPlatforms.push(this.getContainer());
    }

    private onTriggerExit = (_event: f.EventPhysics) => {
      console.log("Ball exited platform");
      controlledPlatforms.splice(controlledPlatforms.indexOf(this.getContainer()));
    }

    private initializeTrigger(node: f.Node): void {
      let left: number = Math.min(...node.getChildren().map(child =>
        child.mtxLocal.translation.x - child.getComponent(f.ComponentMesh).mtxPivot.scaling.x / 2));

      let right: number = Math.max(...node.getChildren().map(child =>
        child.mtxLocal.translation.x + child.getComponent(f.ComponentMesh).mtxPivot.scaling.x / 2));

      let front: number = Math.min(...node.getChildren().map(child =>
        child.mtxLocal.translation.z - child.getComponent(f.ComponentMesh).mtxPivot.scaling.z / 2));

      let back: number = Math.max(...node.getChildren().map(child =>
        child.mtxLocal.translation.z + child.getComponent(f.ComponentMesh).mtxPivot.scaling.z / 2));

      let size: f.Vector3 = new f.Vector3(right - left, 20, back - front);
      let pos: f.Vector3 = new f.Vector3(left + size.x / 2, 0, front + size.z / 2);

      this.trigger = new Trigger(pos, size);
      this.trigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);
      this.trigger.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerExit);

      node.addChild(this.trigger);
    }

  }
}