namespace MazeBallScripts {

  export import f = FudgeCore;

  f.Project.registerScriptNamespace(MazeBallScripts);
  
  export class ComponentScript extends f.ComponentScript {

    constructor() {
      super();
      if (this.onAdded != undefined) this.addEventListener(f.EVENT.COMPONENT_ADD, (event: Event) => {
        if (event.target == this) this.onAdded(event);
      });
    }

    protected onAdded?(_event: Event): void;
    
  }
}