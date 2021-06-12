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
        private onGameReset;
        private onCollision;
    }
}
declare namespace MazeBall {
    class ComponentCannon extends ComponentScript {
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
        private readonly isFinal;
        private startPosition;
        constructor(_final?: boolean);
        protected onAdded(_event: Event): void;
        protected onFloorCollisionEnter: (_event: f.EventPhysics) => void;
        private onGameReset;
        private swapControl;
    }
}
declare namespace MazeBall {
    export enum EVENT_GAME {
        START = "gamestart",
        END = "gameend",
        RESET = "gamereset"
    }
    interface GameSettings {
        fps: number;
        tiltSpeed: number;
        rotateSpeed: number;
        ballMass: number;
        cannonStrength: number;
        projectileMass: number;
        debugMode: string;
        debugDraw: boolean;
    }
    export let gameSettings: GameSettings;
    class Game extends EventTarget {
        private readonly eventStart;
        private readonly eventEnd;
        private readonly eventReset;
        private isFinished;
        private timePassed;
        private clock;
        constructor();
        requestClickToStart(): void;
        finish(_solved?: boolean): void;
        reset: () => void;
        private start;
        private update;
    }
    export const game: Game;
    export {};
}
declare namespace MazeBall {
    let canvas: HTMLCanvasElement;
    let scene: f.Graph;
}
declare namespace MazeBall {
    class PlayerControl extends f.Node {
        viewObject: f.Node;
        controlledPlatform: f.Node;
        readonly camera: f.ComponentCamera;
        private readonly rotateLeftKeys;
        private readonly rotateRightKeys;
        private readonly turnTable;
        constructor();
        private onGameStart;
        private onGameEnd;
        private update;
        private onKeyboardDown;
        private onMouseMove;
        private onWheel;
        private move;
        private rotateLeft;
        private rotateRight;
    }
    export const playerControl: PlayerControl;
    export {};
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
