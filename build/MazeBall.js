"use strict";
var MazeBall;
(function (MazeBall) {
    MazeBall.f = FudgeCore;
    class ComponentScript extends MazeBall.f.ComponentScript {
        constructor() {
            super();
            if (this.onAdded != undefined)
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, (event) => {
                    if (event.target == this)
                        this.onAdded(event);
                });
        }
    }
    MazeBall.ComponentScript = ComponentScript;
})(MazeBall || (MazeBall = {}));
///<reference path="scripts/ComponentScript.ts"/>
///<reference path="ComponentScript.ts"/>
var MazeBall;
///<reference path="ComponentScript.ts"/>
(function (MazeBall) {
    class ComponentBall extends MazeBall.ComponentScript {
        constructor() {
            super(...arguments);
            this.onGameReset = (_event) => {
                let body = this.getContainer().getComponent(MazeBall.f.ComponentRigidbody);
                body.setVelocity(MazeBall.f.Vector3.ZERO());
                body.setAngularVelocity(MazeBall.f.Vector3.ZERO());
                body.setPosition(MazeBall.f.Vector3.Y(3));
            };
            this.onCollision = (_event) => {
                this.ballHitAudio.volume = _event.target.getVelocity().magnitude;
                this.ballHitAudio.play(true);
            };
        }
        onAdded(_event) {
            let node = this.getContainer();
            this.ballHitAudio = new MazeBall.f.ComponentAudio(ComponentBall.ballHitAudio);
            node.addComponent(this.ballHitAudio);
            let body = new MazeBall.f.ComponentRigidbody(20, MazeBall.f.PHYSICS_TYPE.DYNAMIC, MazeBall.f.COLLIDER_TYPE.SPHERE);
            body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
            node.addComponent(body);
            MazeBall.game.addEventListener(MazeBall.Game.reset, this.onGameReset);
        }
    }
    ComponentBall.ballHitAudio = new MazeBall.f.Audio("./resources/sounds/ball_hit.mp3");
    MazeBall.ComponentBall = ComponentBall;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class ComponentCannon extends MazeBall.ComponentScript {
        constructor(_triggerOffset, _triggerSize) {
            super();
            this.strength = 100;
            this.onTriggerEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    this.fire();
            };
            this.singleton = true;
            this.trigger = new MazeBall.Trigger(_triggerOffset, _triggerSize);
            this.trigger.box.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
            this.projectile = new MazeBall.Projectile();
        }
        onAdded(_event) {
            this.getContainer().addChild(this.trigger);
            this.getContainer().addChild(this.projectile);
        }
        fire() {
            console.log("fire");
            const mtxLocal = this.getContainer().mtxLocal;
            this.projectile.fire(MazeBall.f.Vector3.ZERO(), MazeBall.f.Vector3.SCALE(mtxLocal.getZ(), this.strength));
        }
    }
    MazeBall.ComponentCannon = ComponentCannon;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class ComponentMovingWall extends MazeBall.ComponentScript {
        constructor(_vel, _range, _dir) {
            super();
            this.update = (_event) => {
                const mtxLocal = this.getContainer().mtxLocal;
                const movement = MazeBall.f.Vector3.SCALE(this.dir, this.vel * MazeBall.f.Loop.timeFrameReal / 1000);
                const newDistance = MazeBall.f.Vector3.DIFFERENCE(MazeBall.f.Vector3.SUM(mtxLocal.translation, movement), this.origin).magnitude;
                if (newDistance > this.range) {
                    movement.scale(this.range / newDistance);
                    this.dir.scale(-1);
                }
                mtxLocal.translate(movement);
            };
            this.vel = _vel;
            this.range = _range;
            this.dir = _dir;
            MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        onAdded(_event) {
            this.origin = this.getContainer().mtxLocal.translation;
        }
    }
    MazeBall.ComponentMovingWall = ComponentMovingWall;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class ComponentPlatform extends MazeBall.ComponentScript {
        constructor(_final = false) {
            super();
            this.onFloorCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball") {
                    if (this.isFinal)
                        MazeBall.game.finish();
                    else
                        this.swapControl();
                }
            };
            this.onGameReset = (_event) => {
                this.getContainer().mtxLocal.set(MazeBall.f.Matrix4x4.TRANSLATION(this.startPosition));
            };
            this.singleton = true;
            this.isFinal = _final;
        }
        onAdded(_event) {
            let node = this.getContainer();
            node.getChildrenByName("Floor").forEach(floor => {
                let body = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE);
                body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onFloorCollisionEnter);
                floor.addComponent(body);
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Cannon").forEach(cannon => {
                cannon.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
                cannon.addComponent(new MazeBall.ComponentCannon(MazeBall.f.Vector3.Z(6), new MazeBall.f.Vector3(5, 10, 5)));
            });
            this.startPosition = this.getContainer().mtxLocal.translation;
            MazeBall.game.addEventListener(MazeBall.Game.reset, this.onGameReset);
        }
        swapControl() {
            if (MazeBall.PlayerControl.instance.controlledPlatform != this.getContainer()) {
                MazeBall.PlayerControl.instance.controlledPlatform = this.getContainer();
                ComponentPlatform.swapControlAudio.play(true);
            }
        }
    }
    ComponentPlatform.swapControlAudio = new MazeBall.f.ComponentAudio(new MazeBall.f.Audio("./resources/sounds/control_swap.mp3"));
    MazeBall.ComponentPlatform = ComponentPlatform;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class Game extends EventTarget {
        constructor() {
            super(...arguments);
            this.eventStart = new Event(Game.start);
            this.eventEnd = new Event(Game.end);
            this.eventReset = new Event(Game.reset);
            this.isFinished = false;
            this.reset = () => {
                if (!this.isFinished)
                    this.finish(false);
                else
                    MazeBall.canvas.removeEventListener("click", this.reset);
                this.dispatchEvent(this.eventReset);
                this.requestClickToStart();
                MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, Game.fps);
            };
            this.start = () => {
                this.isFinished = false;
                document.getElementById("message").className = "invisible";
                MazeBall.canvas.removeEventListener("click", this.start);
                MazeBall.canvas.requestPointerLock();
                this.dispatchEvent(this.eventStart);
                MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, Game.fps);
            };
        }
        requestClickToStart() {
            let message = document.getElementById("message");
            message.className = "blink";
            message.innerText = "click to start";
            MazeBall.canvas.addEventListener("click", this.start);
        }
        finish(_solved = true) {
            if (_solved) {
                let message = document.getElementById("message");
                message.className = "blink";
                message.innerText = "Finished!\nclick to reset";
                MazeBall.canvas.addEventListener("click", this.reset);
            }
            this.isFinished = true;
            this.dispatchEvent(this.eventEnd);
            MazeBall.f.Loop.stop();
        }
    }
    Game.fps = 120;
    Game.start = "gamestart";
    Game.end = "gameend";
    Game.reset = "gamereset";
    MazeBall.Game = Game;
    MazeBall.game = new Game();
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    let viewport;
    window.addEventListener("load", init);
    async function init() {
        MazeBall.canvas = document.querySelector("canvas");
        // load resources referenced in the link-tag
        await MazeBall.f.Project.loadResourcesFromHTML();
        MazeBall.f.Debug.log("Project:", MazeBall.f.Project.resources);
        // initialize physics
        MazeBall.f.Physics.initializePhysics();
        MazeBall.f.Physics.settings.debugMode = MazeBall.f.PHYSICS_DEBUGMODE.COLLIDERS;
        MazeBall.f.Physics.settings.debugDraw = true;
        // setup graph
        MazeBall.scene = MazeBall.f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"];
        MazeBall.scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new MazeBall.ComponentPlatform()));
        MazeBall.scene.getChildrenByName("FinalPlatform")[0].addComponent(new MazeBall.ComponentPlatform(true));
        MazeBall.scene.getChildrenByName("Ball")[0].addComponent(new MazeBall.ComponentBall());
        MazeBall.scene.getChildrenByName("Platform")[1].getChildrenByName("Wall")[0].addComponent(new MazeBall.ComponentMovingWall(5, 5, MazeBall.f.Vector3.X()));
        MazeBall.f.Debug.log("Scene:", MazeBall.scene);
        // setup player control
        MazeBall.scene.addChild(MazeBall.PlayerControl.instance);
        MazeBall.PlayerControl.instance.viewObject = MazeBall.scene.getChildrenByName("Ball")[0];
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", MazeBall.scene, MazeBall.PlayerControl.instance.camera, MazeBall.canvas);
        MazeBall.f.Debug.log("Viewport:", viewport);
        // setup audio
        MazeBall.scene.addComponent(MazeBall.ComponentPlatform.swapControlAudio);
        let cmpListener = new MazeBall.f.ComponentAudioListener();
        MazeBall.scene.addComponent(cmpListener);
        MazeBall.f.AudioManager.default.listenWith(cmpListener);
        MazeBall.f.AudioManager.default.listenTo(MazeBall.scene);
        MazeBall.f.Debug.log("Audio:", MazeBall.f.AudioManager.default);
        // start
        MazeBall.f.Physics.adjustTransforms(MazeBall.scene, true);
        MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.Game.fps);
        viewport.draw();
        MazeBall.game.requestClickToStart();
    }
    function update() {
        MazeBall.f.Physics.world.simulate(MazeBall.f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class PlayerControl extends MazeBall.f.Node {
        constructor() {
            super("PlayerControl");
            this.rotateLeftKeys = [
                MazeBall.f.KEYBOARD_CODE.A,
                MazeBall.f.KEYBOARD_CODE.ARROW_LEFT
            ];
            this.rotateRightKeys = [
                MazeBall.f.KEYBOARD_CODE.D,
                MazeBall.f.KEYBOARD_CODE.ARROW_RIGHT
            ];
            this.onGameStart = (_event) => {
                this.controlledPlatform = MazeBall.scene.getChildrenByName("Platform")[0];
                window.addEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.addEventListener("mousemove", this.handleMouse);
                MazeBall.canvas.addEventListener("wheel", this.handleWheel);
            };
            this.onGameEnd = (_event) => {
                window.removeEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.removeEventListener("mousemove", this.handleMouse);
                MazeBall.canvas.removeEventListener("wheel", this.handleWheel);
            };
            this.update = (_event) => {
                this.move();
            };
            this.onKeyboardDown = (_event) => {
                if (this.rotateLeftKeys.includes(_event.code))
                    this.rotateLeft();
                else if (this.rotateRightKeys.includes(_event.code))
                    this.rotateRight();
            };
            this.handleMouse = (_event) => {
                this.controlledPlatform.mtxLocal.rotateX(_event.movementY * 0.05);
                this.controlledPlatform.mtxLocal.rotateZ(_event.movementX * -0.05);
            };
            this.handleWheel = (_event) => {
                this.controlledPlatform.mtxLocal.rotateY(_event.deltaY * 0.05);
            };
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.turnTable = new MazeBall.f.Node("Camera");
            this.turnTable.addComponent(new MazeBall.f.ComponentTransform());
            this.camera = new MazeBall.f.ComponentCamera();
            this.camera.mtxPivot.translateY(30);
            this.camera.mtxPivot.translateZ(30);
            this.camera.mtxPivot.rotateY(180);
            this.camera.mtxPivot.rotateX(45);
            this.turnTable.addComponent(this.camera);
            this.addChild(this.turnTable);
            MazeBall.game.addEventListener(MazeBall.Game.start, this.onGameStart);
            MazeBall.game.addEventListener(MazeBall.Game.end, this.onGameEnd);
            MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static get instance() {
            if (this._instance == undefined)
                this._instance = new PlayerControl();
            return this._instance;
        }
        move() {
            let difference = MazeBall.f.Vector3.DIFFERENCE(this.viewObject.mtxLocal.translation, this.mtxLocal.translation);
            difference.scale(1 / (1 + difference.magnitude));
            this.mtxLocal.translate(difference);
        }
        rotateLeft() {
            this.turnTable.mtxLocal.rotateY(-90);
        }
        rotateRight() {
            this.turnTable.mtxLocal.rotateY(90);
        }
    }
    MazeBall.PlayerControl = PlayerControl;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class Projectile extends MazeBall.f.Node {
        constructor() {
            super("Projectile");
            let cmpMesh = new MazeBall.f.ComponentMesh(MazeBall.f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"]);
            cmpMesh.mtxPivot.scale(MazeBall.f.Vector3.ONE(0.5));
            this.addComponent(cmpMesh);
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.body = new MazeBall.f.ComponentRigidbody(20, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.SPHERE, MazeBall.f.PHYSICS_GROUP.TRIGGER);
            this.addComponent(this.body);
            this.activate(false);
        }
        fire(_pos, _force) {
            this.mtxLocal.translate(MazeBall.f.Vector3.DIFFERENCE(_pos, this.mtxLocal.translation));
            this.activate(true);
            this.body.physicsType = MazeBall.f.PHYSICS_TYPE.DYNAMIC;
            this.body.applyForce(_force);
        }
    }
    MazeBall.Projectile = Projectile;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class Trigger extends MazeBall.f.Node {
        constructor(_pos, _size) {
            super("Trigger");
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.mtxLocal.translate(_pos);
            this.mtxLocal.scale(_size);
            this.box = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.CUBE, MazeBall.f.PHYSICS_GROUP.TRIGGER);
            this.addComponent(this.box);
        }
    }
    MazeBall.Trigger = Trigger;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=MazeBall.js.map