namespace MazeBall {
  export import f = FudgeCore;
  
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