"use strict";
var MazeBallScripts;
(function (MazeBallScripts) {
    MazeBallScripts.f = FudgeCore;
    MazeBallScripts.f.Project.registerScriptNamespace(MazeBallScripts);
    class ComponentScript extends MazeBallScripts.f.ComponentScript {
        constructor() {
            super();
            if (this.onAdded != undefined && MazeBallScripts.f.Project.mode != MazeBallScripts.f.MODE.EDITOR) {
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, (event) => {
                    if (event.target == this)
                        this.onAdded(event);
                });
            }
        }
    }
    MazeBallScripts.ComponentScript = ComponentScript;
})(MazeBallScripts || (MazeBallScripts = {}));
///<reference path="scripts/ComponentScript.ts"/>
var MazeBall;
(function (MazeBall) {
    MazeBall.f = FudgeCore;
    let EVENT_GAME;
    (function (EVENT_GAME) {
        EVENT_GAME["START"] = "gamestart";
        EVENT_GAME["END"] = "gameend";
        EVENT_GAME["RESET"] = "gamereset";
    })(EVENT_GAME = MazeBall.EVENT_GAME || (MazeBall.EVENT_GAME = {}));
    class Game extends EventTarget {
        constructor() {
            super();
            this.eventStart = new Event(EVENT_GAME.START);
            this.eventEnd = new Event(EVENT_GAME.END);
            this.eventReset = new Event(EVENT_GAME.RESET);
            this.isFinished = false;
            this.timePassed = new Date(0);
            this.reset = () => {
                if (!this.isFinished)
                    this.finish(false);
                else
                    MazeBall.canvas.removeEventListener("click", this.reset);
                this.dispatchEvent(this.eventReset);
                this.clock.innerText = "0:00:000";
                this.requestClickToStart();
                MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.gameSettings.fps);
            };
            this.start = () => {
                this.isFinished = false;
                document.getElementById("message").className = "invisible";
                MazeBall.canvas.removeEventListener("click", this.start);
                MazeBall.canvas.requestPointerLock();
                this.dispatchEvent(this.eventStart);
                MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.gameSettings.fps);
            };
            this.update = () => {
                this.timePassed = new Date(MazeBall.f.Time.game.get() - MazeBall.f.Loop.timeStartReal);
                this.clock.innerText = this.timePassed.getMinutes() + ":"
                    + this.timePassed.getSeconds().toLocaleString("en", { minimumIntegerDigits: 2 }) + ":"
                    + this.timePassed.getMilliseconds().toLocaleString("en", { minimumIntegerDigits: 3 });
            };
            this.addEventListener(EVENT_GAME.START, () => MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update));
            this.addEventListener(EVENT_GAME.END, () => MazeBall.f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update));
        }
        #message;
        #clock;
        get message() {
            if (!this.#message)
                this.#message = document.getElementById("message");
            return this.#message;
        }
        get clock() {
            if (!this.#clock)
                this.#clock = document.getElementById("clock");
            return this.#clock;
        }
        requestClickToStart() {
            this.message.className = "blink";
            this.message.innerText = "click to start";
            MazeBall.canvas.addEventListener("click", this.start);
        }
        finish(_solved = true) {
            if (_solved) {
                this.message.className = "blink";
                this.message.innerText = "Finished!\nclick to reset";
                MazeBall.canvas.addEventListener("click", this.reset);
            }
            this.isFinished = true;
            this.dispatchEvent(this.eventEnd);
            MazeBall.f.Loop.stop();
        }
    }
    MazeBall.game = new Game();
})(MazeBall || (MazeBall = {}));
///<reference path="ComponentScript.ts"/>
///<reference path="Game.ts"/>
var MazeBallScripts;
///<reference path="ComponentScript.ts"/>
///<reference path="Game.ts"/>
(function (MazeBallScripts) {
    class ComponentBall extends MazeBallScripts.ComponentScript {
        constructor() {
            super(...arguments);
            this.onGameReset = (_event) => {
                const body = this.getContainer().getComponent(MazeBallScripts.f.ComponentRigidbody);
                body.setVelocity(MazeBallScripts.f.Vector3.ZERO());
                body.setAngularVelocity(MazeBallScripts.f.Vector3.ZERO());
                body.setPosition(MazeBallScripts.f.Vector3.Y(3));
            };
            this.onCollision = (_event) => {
                const audio = this.getContainer().getComponent(MazeBallScripts.f.ComponentAudio);
                audio.volume = _event.target.getVelocity().magnitude;
                audio.play(true);
            };
        }
        onAdded(_event) {
            const node = this.getContainer();
            const body = new MazeBallScripts.f.ComponentRigidbody(MazeBall.gameSettings.ballMass, MazeBallScripts.f.PHYSICS_TYPE.DYNAMIC, MazeBallScripts.f.COLLIDER_TYPE.SPHERE);
            body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
            node.addComponent(body);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
        }
    }
    MazeBallScripts.ComponentBall = ComponentBall;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBallScripts;
(function (MazeBallScripts) {
    class ComponentCannon extends MazeBallScripts.ComponentScript {
        constructor(_triggerOffset = MazeBallScripts.f.Vector3.ZERO(), _triggerSize = MazeBallScripts.f.Vector3.ONE()) {
            super();
            this.onTriggerEnter = (_event) => {
                const other = _event.cmpRigidbody.getContainer();
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    this.fire(other);
            };
            this.singleton = true;
            this.triggerOffset = _triggerOffset;
            this.triggerSize = _triggerSize;
        }
        #projectile;
        onAdded(_event) {
            const trigger = new MazeBall.Trigger(this.triggerOffset, this.triggerSize);
            trigger.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onTriggerEnter);
            this.#projectile = new MazeBall.Projectile();
            this.getContainer().addChild(trigger);
            this.getContainer().addChild(this.#projectile);
        }
        fire(_target) {
            console.log("fire");
            // calculate start position and force for the projectile to fire
            const node = this.getContainer();
            const cannonPos = node.mtxWorld.translation;
            const forward = node.mtxWorld.getZ();
            const distanceToTarget = MazeBallScripts.f.Vector3.DIFFERENCE(cannonPos, _target.mtxWorld.translation).magnitude;
            const projectileStartPos = MazeBallScripts.f.Vector3.SUM(cannonPos, MazeBallScripts.f.Vector3.SCALE(forward, 2));
            const force = MazeBallScripts.f.Vector3.SCALE(forward, distanceToTarget * MazeBall.gameSettings.cannonStrength);
            this.#projectile.fire(projectileStartPos, force);
        }
    }
    MazeBallScripts.ComponentCannon = ComponentCannon;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBallScripts;
(function (MazeBallScripts) {
    class ComponentMovement extends MazeBallScripts.ComponentScript {
        constructor(_movement = MazeBallScripts.f.Vector3.X(), _speed = 1, _loop = true) {
            super();
            this.onGameReset = (_event) => {
                const mtxLocal = this.getContainer().mtxLocal;
                mtxLocal.translate(MazeBallScripts.f.Vector3.DIFFERENCE(this.#startPos, mtxLocal.translation));
            };
            this.update = (_event) => {
                const mtxLocal = this.getContainer().mtxLocal;
                const movement = MazeBallScripts.f.Vector3.SCALE(this.#dir, this.speed * MazeBallScripts.f.Loop.timeFrameReal / 1000);
                const distanceToCenter = MazeBallScripts.f.Vector3.DIFFERENCE(MazeBallScripts.f.Vector3.SUM(mtxLocal.translation, movement), this.#center).magnitude;
                if (distanceToCenter > this.#range) {
                    movement.scale(this.#range / distanceToCenter);
                    if (this.loop)
                        this.#dir.scale(-1);
                    else
                        MazeBallScripts.f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                }
                mtxLocal.translate(movement);
            };
            this.singleton = true;
            this.movement = _movement;
            this.speed = _speed;
            this.loop = _loop;
        }
        #startPos;
        #dir;
        #center;
        #range;
        start() {
            this.#center = MazeBallScripts.f.Vector3.SUM(this.getContainer().mtxLocal.translation, MazeBallScripts.f.Vector3.SCALE(this.movement, 0.5));
            this.#range = this.movement.magnitude / 2;
            this.#dir = MazeBallScripts.f.Vector3.NORMALIZATION(this.movement);
            MazeBallScripts.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        onAdded(_event) {
            this.#startPos = this.getContainer().mtxLocal.translation;
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
            if (this.loop)
                MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, () => this.start());
        }
    }
    MazeBallScripts.ComponentMovement = ComponentMovement;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBallScripts;
(function (MazeBallScripts) {
    class ComponentPlatform extends MazeBallScripts.ComponentScript {
        constructor(_final = false) {
            super();
            this.onChildAppend = (_event) => {
                if (_event.currentTarget == _event.target) {
                    // this components node has been appended
                    const node = this.getContainer();
                    node.removeEventListener("childAppend" /* CHILD_APPEND */, this.onChildAppend);
                    if (!this.isFinal) {
                        // Append turn table
                        this.#turnTable = new MazeBall.TurnTable();
                        node.getParent().addChild(this.#turnTable);
                        this.#turnTable.mtxLocal.translate(node.mtxLocal.translation);
                        node.mtxLocal.set(MazeBallScripts.f.Matrix4x4.ROTATION(node.mtxLocal.rotation));
                        this.#turnTable.addChild(node);
                    }
                    this.addRigidBodies();
                }
            };
            this.onFloorCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball") {
                    if (this.isFinal)
                        MazeBall.game.finish();
                    else
                        this.swapControl();
                }
            };
            this.singleton = true;
            this.isFinal = _final;
        }
        #turnTable;
        onAdded(_event) {
            this.getContainer().addEventListener("childAppend" /* CHILD_APPEND */, this.onChildAppend);
        }
        addRigidBodies() {
            const node = this.getContainer();
            node.getChildrenByName("Floor").forEach(floor => {
                console.log("test");
                const body = new MazeBallScripts.f.ComponentRigidbody(0, MazeBallScripts.f.PHYSICS_TYPE.KINEMATIC, MazeBallScripts.f.COLLIDER_TYPE.CUBE);
                body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onFloorCollisionEnter);
                floor.addComponent(body);
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new MazeBallScripts.f.ComponentRigidbody(0, MazeBallScripts.f.PHYSICS_TYPE.KINEMATIC, MazeBallScripts.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Cannon").forEach(cannon => {
                cannon.addComponent(new MazeBallScripts.f.ComponentRigidbody(0, MazeBallScripts.f.PHYSICS_TYPE.KINEMATIC, MazeBallScripts.f.COLLIDER_TYPE.CUBE));
            });
        }
        swapControl() {
            if (MazeBall.playerControl.controlledPlatformTurntable != this.#turnTable) {
                MazeBall.playerControl.controlledPlatformTurntable = this.#turnTable;
            }
        }
    }
    MazeBallScripts.ComponentPlatform = ComponentPlatform;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBall;
(function (MazeBall) {
    let viewport;
    window.addEventListener("load", init);
    async function init() {
        MazeBall.canvas = document.querySelector("canvas");
        MazeBall.f.Physics.initializePhysics();
        // load game settings
        const response = await fetch("./../resources/GameSettings.json");
        MazeBall.gameSettings = await response.json();
        MazeBall.f.Physics.settings.debugMode = MazeBall.gameSettings.debugMode;
        MazeBall.f.Physics.settings.debugDraw = MazeBall.gameSettings.debugDraw;
        // load scene
        await MazeBall.f.Project.loadResources("./../resources/Scene.json");
        const scene = MazeBall.f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"];
        MazeBall.f.Debug.log("Scene:", scene);
        // setup player control
        scene.addChild(MazeBall.playerControl);
        MazeBall.playerControl.viewObject = scene.getChildrenByName("Ball")[0];
        MazeBall.playerControl.startPlatformTurntable = scene.getChildrenByName("TurnTable")[0];
        console.log(MazeBall.playerControl.startPlatformTurntable);
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", scene, MazeBall.playerControl.camera, MazeBall.canvas);
        MazeBall.f.Debug.log("Viewport:", viewport);
        // setup audio
        let cmpListener = new MazeBall.f.ComponentAudioListener();
        scene.addComponent(cmpListener);
        MazeBall.f.AudioManager.default.listenWith(cmpListener);
        MazeBall.f.AudioManager.default.listenTo(scene);
        MazeBall.f.Debug.log("Audio:", MazeBall.f.AudioManager.default);
        // start
        MazeBall.f.Physics.adjustTransforms(scene, true);
        MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.gameSettings.fps);
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
                this.controlledPlatformTurntable = this.startPlatformTurntable;
                window.addEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.addEventListener("mousemove", this.onMouseMove);
                MazeBall.canvas.addEventListener("wheel", this.onWheel);
            };
            this.onGameEnd = (_event) => {
                window.removeEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.removeEventListener("mousemove", this.onMouseMove);
                MazeBall.canvas.removeEventListener("wheel", this.onWheel);
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
            this.onMouseMove = (_event) => {
                this.controlledPlatformTurntable.rotateX(_event.movementY * MazeBall.gameSettings.tiltSpeed);
                this.controlledPlatformTurntable.rotateZ(_event.movementX * -MazeBall.gameSettings.tiltSpeed);
            };
            this.onWheel = (_event) => {
                this.controlledPlatformTurntable.rotateY(_event.deltaY * MazeBall.gameSettings.rotateSpeed);
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
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, this.onGameStart);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.END, this.onGameEnd);
            MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        move() {
            const difference = MazeBall.f.Vector3.DIFFERENCE(this.viewObject.mtxLocal.translation, this.mtxLocal.translation);
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
    MazeBall.playerControl = new PlayerControl();
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class Projectile extends MazeBall.f.Node {
        constructor() {
            super("Projectile");
            this.addComponent(new MazeBall.f.ComponentMesh(MazeBall.f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"]));
            this.addComponent(new MazeBall.f.ComponentMaterial(MazeBall.f.Project.resources["Material|2021-05-25T15:28:46.097Z|64234"]));
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.mtxLocal.scale(MazeBall.f.Vector3.ONE(0.75));
            this.mtxLocal.translateY(-1);
            this.body = new MazeBall.f.ComponentRigidbody(MazeBall.gameSettings.projectileMass, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.SPHERE, MazeBall.f.PHYSICS_GROUP.DEFAULT, this.mtxLocal);
            this.addComponent(this.body);
            this.activate(false);
        }
        fire(_pos, _force) {
            this.activate(true);
            this.body.physicsType = MazeBall.f.PHYSICS_TYPE.DYNAMIC;
            this.body.setVelocity(MazeBall.f.Vector3.ZERO());
            this.body.setAngularVelocity(MazeBall.f.Vector3.ZERO());
            this.body.setPosition(_pos);
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
            this.box.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => this.dispatchEvent(_event));
            this.box.addEventListener("TriggerLeftCollision" /* TRIGGER_EXIT */, (_event) => this.dispatchEvent(_event));
            this.addComponent(this.box);
        }
    }
    MazeBall.Trigger = Trigger;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    class TurnTable extends MazeBall.f.Node {
        constructor() {
            super("TurnTable");
            this.onGameReset = (_event) => {
                this.axisX.mtxLocal.rotateX(-this.axisX.mtxLocal.rotation.x);
                this.axisY.mtxLocal.rotateY(-this.axisY.mtxLocal.rotation.y);
                this.axisZ.mtxLocal.rotateZ(-this.axisZ.mtxLocal.rotation.z);
            };
            this.axisY = this;
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.axisX = new MazeBall.f.Node("AxisX");
            this.axisX.addComponent(new MazeBall.f.ComponentTransform());
            super.addChild(this.axisX);
            this.axisZ = new MazeBall.f.Node("AxisZ");
            this.axisZ.addComponent(new MazeBall.f.ComponentTransform());
            this.axisX.addChild(this.axisZ);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
        }
        addChild(_child) {
            this.axisZ.addChild(_child);
        }
        rotateX(_angleInDegrees) {
            const axis = this.axisX.mtxLocal;
            axis.rotateX(_angleInDegrees);
            if (axis.rotation.x < -MazeBall.gameSettings.tiltMax)
                axis.rotateX(-MazeBall.gameSettings.tiltMax - axis.rotation.x);
            if (axis.rotation.x > MazeBall.gameSettings.tiltMax)
                axis.rotateX(MazeBall.gameSettings.tiltMax - axis.rotation.x);
        }
        rotateY(_angleInDegrees) {
            this.axisY.mtxLocal.rotateY(_angleInDegrees);
        }
        rotateZ(_angleInDegrees) {
            const axis = this.axisZ.mtxLocal;
            axis.rotateZ(_angleInDegrees);
            if (axis.rotation.z < -MazeBall.gameSettings.tiltMax)
                axis.rotateZ(-MazeBall.gameSettings.tiltMax - axis.rotation.z);
            if (axis.rotation.z > MazeBall.gameSettings.tiltMax)
                axis.rotateZ(MazeBall.gameSettings.tiltMax - axis.rotation.z);
        }
    }
    MazeBall.TurnTable = TurnTable;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=MazeBall.js.map