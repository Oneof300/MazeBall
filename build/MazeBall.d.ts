declare namespace MazeBallScripts {
    export import f = FudgeCore;
    export import mb = MazeBall;
    class ComponentScript extends f.ComponentScript {
        constructor();
        protected onAdded?(_event: Event): void;
    }
}
declare namespace MazeBall {
    export import f = FudgeCore;
    export import mbs = MazeBallScripts;
    export enum EVENT_GAME {
        START = "gamestart",
        END = "gameend",
        RESET = "gamereset"
    }
    interface GameSettings {
        fps: number;
        tiltSpeed: number;
        tiltMax: number;
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
declare namespace MazeBallScripts {
    export import mb = MazeBall;
    class ComponentBall extends ComponentScript {
        private static ballHitAudio;
        private ballHitAudio;
        protected onAdded(_event: Event): void;
        private onGameReset;
        private onCollision;
    }
}
declare namespace MazeBallScripts {
    class ComponentCannon extends ComponentScript {
        private trigger;
        private projectile;
        constructor(_triggerOffset: f.Vector3, _triggerSize: f.Vector3);
        protected onAdded(_event: Event): void;
        private onTriggerEnter;
        private fire;
    }
}
declare namespace MazeBallScripts {
    class ComponentMovingWall extends ComponentScript {
        private vel;
        private range;
        private dir;
        private origin;
        constructor(_vel?: number, _range?: number, _dir?: f.Vector3);
        protected onAdded(_event: Event): void;
        private update;
    }
}
declare namespace MazeBallScripts {
    class ComponentPlatform extends ComponentScript {
        static readonly swapControlAudio: f.ComponentAudio;
        readonly turnTable: TurnTable;
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
    let canvas: HTMLCanvasElement;
    let scene: f.Graph;
}
declare namespace MazeBall {
    class PlayerControl extends f.Node {
        viewObject: f.Node;
        controlledPlatformTurntable: mbs.TurnTable;
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
declare namespace MazeBallScripts {
    class Projectile extends f.Node {
        private body;
        constructor();
        fire(_pos: f.Vector3, _force: f.Vector3): void;
    }
}
declare namespace MazeBallScripts {
    class Trigger extends f.Node {
        readonly box: f.ComponentRigidbody;
        constructor(_pos: f.Vector3, _size: f.Vector3);
    }
}
declare namespace MazeBallScripts {
    class TurnTable extends f.Node {
        private readonly axisX;
        private readonly axisY;
        private readonly axisZ;
        constructor();
        addChild(_child: f.Node): void;
        rotateX(_angleInDegrees: number): void;
        rotateY(_angleInDegrees: number): void;
        rotateZ(_angleInDegrees: number): void;
    }
}
