declare namespace MazeBall {
    export import f = FudgeCore;
    class ComponentScript extends f.ComponentScript {
        constructor();
        protected onAdded?(_event: Event): void;
    }
}
declare namespace MazeBall {
    class ComponentBall extends ComponentScript {
        private static ballHitAudio;
        private ballHitAudio;
        protected onAdded(_event: Event): void;
        private onCollision;
    }
}
declare namespace MazeBall {
    class ComponentCannon extends ComponentScript {
        readonly strength: number;
        private trigger;
        private projectile;
        constructor(_triggerOffset: f.Vector3, _triggerSize: f.Vector3);
        protected onAdded(_event: Event): void;
        private onTriggerEnter;
        private fire;
    }
}
declare namespace MazeBall {
    class ComponentMovingWall extends ComponentScript {
        private readonly vel;
        private readonly range;
        private readonly dir;
        private origin;
        constructor(_vel: number, _range: number, _dir: f.Vector3);
        protected onAdded(_event: Event): void;
        private update;
    }
}
declare namespace MazeBall {
    class ComponentPlatform extends ComponentScript {
        static readonly swapControlAudio: f.ComponentAudio;
        constructor();
        protected onAdded(_event: Event): void;
        private onCollisionEnter;
        private swapControl;
    }
}
declare namespace MazeBall {
    class Game extends EventTarget {
        static readonly start: string;
        static readonly end: string;
        private _start;
        private _end;
        requestClickToStart(): void;
        start(): void;
        end(): void;
    }
    const game: Game;
}
declare namespace MazeBall {
    let canvas: HTMLCanvasElement;
    let scene: f.Graph;
}
declare namespace MazeBall {
    class PlayerControl extends f.Node {
        private static _instance;
        viewObject: f.Node;
        controlledPlatform: f.Node;
        readonly camera: f.ComponentCamera;
        private readonly rotateLeftKeys;
        private readonly rotateRightKeys;
        private readonly turnTable;
        private constructor();
        static get instance(): PlayerControl;
        private onGameStart;
        private onGameEnd;
        private update;
        private onKeyboardDown;
        private handleMouse;
        private handleWheel;
        private move;
        private rotateLeft;
        private rotateRight;
    }
}
declare namespace MazeBall {
    class Projectile extends f.Node {
        private body;
        constructor();
        fire(_pos: f.Vector3, _force: f.Vector3): void;
    }
}
declare namespace MazeBall {
    class Trigger extends f.Node {
        readonly box: f.ComponentRigidbody;
        constructor(_pos: f.Vector3, _size: f.Vector3);
    }
}
