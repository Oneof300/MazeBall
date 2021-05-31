namespace PuzzleGame {

  export class ComponentPlatform extends ComponentScript {

    private triggers: f.ComponentRigidbody[] = new Array();

    protected onAdded(_event: Event): void {
      let node: f.Node = this.getContainer();

      node.getChildrenByName("Floor").forEach(floor => {
        let triggerNode: f.Node = new f.Node("Trigger");
        
        let floorMeshScaling: f.Vector3 = floor.getComponent(f.ComponentMesh).mtxPivot.scaling;
        triggerNode.addComponent(new f.ComponentTransform());
        triggerNode.mtxLocal.translate(floor.mtxLocal.translation);
        triggerNode.mtxLocal.scale(new f.Vector3(floorMeshScaling.x, 20, floorMeshScaling.z));

        let triggerBody: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
        triggerBody.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);
        triggerBody.addEventListener(f.EVENT_PHYSICS.TRIGGER_EXIT, this.onTriggerExit);
        triggerNode.addComponent(triggerBody);
        this.triggers.push(triggerBody);

        scene.addChild(triggerNode);
      });

      node.getChildrenByName("Floor").forEach(floor => {
        floor.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
  
      node.getChildrenByName("Wall").forEach(wall => {
        wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE));
      });
    }

    private onTriggerEnter = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.getContainer().name == "Ball"
      && !this.triggers.some(trigger => trigger != _event.target && trigger.bodiesInTrigger.includes(_event.cmpRigidbody))) {
        this.onBallEnteredPlatform(_event);
      }
    }

    private onTriggerExit = (_event: f.EventPhysics): void => {
      if (_event.cmpRigidbody.getContainer().name == "Ball"
      && !this.triggers.some(trigger => trigger.bodiesInTrigger.includes(_event.cmpRigidbody))) {
        this.onBallExitedPlatform(_event);
      }
    }

    private onBallEnteredPlatform(_event: f.EventPhysics): void {
      console.log("Ball entered platform");
      controlledPlatforms.push(this.getContainer());
    }

    private onBallExitedPlatform(_event: f.EventPhysics): void {
      console.log("Ball exited platform");
      controlledPlatforms.splice(controlledPlatforms.indexOf(this.getContainer()));
    }

  }

}