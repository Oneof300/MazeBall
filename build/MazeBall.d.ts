declare namespace MazeBallScripts {
    export import f = FudgeCore;
    class ComponentScript extends f.ComponentScript {
        constructor();
        protected get node(): f.Node;
        protected onAdded?(_event: Event): void;
    }
}
declare namespace MazeBallScripts {
    class ComponentBall extends ComponentScript {
        #private;
        private resetHeight;
        constructor(_resetHight?: number);
        protected onAdded(_event: Event): void;
        private onGameReset;
        private onCollisionEnter;
        private update;
    }
}
declare namespace MazeBallScripts {
    class ComponentCannon extends ComponentScript {
        #private;
        private range;
        constructor(_range?: number);
        private get ball();
        protected onAdded(_event: Event): void;
        private onGameStart;
        private onGameEnd;
        private update;
        private fire;
    }
}
declare namespace MazeBallScripts {
    class ComponentMovement extends ComponentScript {
        #private;
        private movement;
        private speed;
        private loop;
        constructor(_movement?: f.Vector3, _speed?: number, _loop?: boolean);
        start(): void;
        protected onAdded(_event: Event): void;
        private onGameReset;
        private update;
    }
}
declare namespace MazeBallScripts {
    class ComponentPlatform extends ComponentScript {
        #private;
        private static readonly eventBallEnter;
        private isFinal;
        constructor(_final?: boolean);
        protected onAdded(_event: Event): void;
        private onChildAppend;
        private onFloorCollisionEnter;
        private addRigidBodies;
        private swapControl;
    }
}
declare namespace MazeBall {
    export import f = FudgeCore;
    export enum EVENT_GAME {
        START = "gamestart",
        END = "gameend",
        RESET = "gamereset",
        SOLVED = "gamesolved"
    }
    interface GameSettings {
        fps: number;
        tiltSpeed: number;
        tiltMax: number;
        rotateSpeed: number;
        ballMass: number;
        cannonStrength: number;
        projectileMass: number;
        debugMode: f.PHYSICS_DEBUGMODE;
        debugDraw: boolean;
    }
    export let gameSettings: GameSettings;
    class Game extends EventTarget {
        #private;
        private readonly eventStart;
        private readonly eventEnd;
        private readonly eventReset;
        private readonly eventSolved;
        private timePassed;
        constructor();
        get isRunning(): boolean;
        private get canvas();
        private get message();
        private get clock();
        private get menu();
        private get finishedDialog();
        private get nameInput();
        private get time();
        requestClickToStart(): void;
        end(_solved?: boolean): void;
        reset(): void;
        private start;
        private update;
        private onKeyDown;
        private resume;
        private onNameInputKeyDown;
        private registerHighscore;
    }
    export const game: Game;
    export {};
}
declare namespace MazeBall {
    function getResourceByName(_name: string): f.SerializableResource;
}
declare namespace MazeBall {
    class PlayerControl extends f.Node {
        #private;
        viewObject: f.Node;
        readonly camera: f.ComponentCamera;
        private readonly rotateLeftKeys;
        private readonly rotateRightKeys;
        private readonly turnTable;
        constructor();
        get controlledPlatformTurntable(): TurnTable;
        set controlledPlatformTurntable(_value: TurnTable);
        get audioControlSwap(): f.ComponentAudio;
        get audioFinish(): f.ComponentAudio;
        private onGameStart;
        private onGameEnd;
        private onGameSolved;
        private update;
        private onKeyDown;
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
        private readonly body;
        constructor(_material: f.Material);
        fire(_pos: f.Vector3, _force: f.Vector3): void;
        private onReset;
    }
}
declare namespace MazeBall {
    class Trigger extends f.Node {
        private readonly box;
        constructor(_pos: f.Vector3, _size: f.Vector3);
    }
}
declare namespace MazeBall {
    class TurnTable extends f.Node {
        private readonly axisX;
        private readonly axisY;
        private readonly axisZ;
        constructor();
        addChild(_child: f.Node): void;
        getChild(_index: number): f.Node;
        rotateX(_angleInDegrees: number): void;
        rotateY(_angleInDegrees: number): void;
        rotateZ(_angleInDegrees: number): void;
        private onGameReset;
    }
}
