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
            let body = new MazeBall.f.ComponentRigidbody(MazeBall.gameSettings.ballMass, MazeBall.f.PHYSICS_TYPE.DYNAMIC, MazeBall.f.COLLIDER_TYPE.SPHERE);
            body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
            node.addComponent(body);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
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
            this.onTriggerEnter = (_event) => {
                const other = _event.cmpRigidbody.getContainer();
                if (other.name == "Ball")
                    this.fire(other);
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
        fire(_target) {
            console.log("fire");
            const mtxWorld = this.getContainer().mtxWorld;
            const distanceToTarget = MazeBall.f.Vector3.DIFFERENCE(mtxWorld.translation, _target.mtxWorld.translation).magnitude;
            this.projectile.fire(MazeBall.f.Vector3.SUM(mtxWorld.translation, MazeBall.f.Vector3.SCALE(mtxWorld.getZ(), 2)), MazeBall.f.Vector3.SCALE(mtxWorld.getZ(), MazeBall.gameSettings.cannonStrength * distanceToTarget));
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
            this.turnTable = new MazeBall.TurnTable();
        }
        onAdded(_event) {
            const node = this.getContainer();
            node.getParent().addChild(this.turnTable);
            this.turnTable.mtxLocal.translate(node.mtxLocal.translation);
            node.mtxLocal.set(MazeBall.f.Matrix4x4.ROTATION(node.mtxLocal.rotation));
            this.turnTable.addChild(node);
            node.getChildrenByName("Floor").forEach(floor => {
                const body = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE);
                body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onFloorCollisionEnter);
                floor.addComponent(body);
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Cannon").forEach(cannon => {
                cannon.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
                cannon.addComponent(new MazeBall.ComponentCannon(MazeBall.f.Vector3.Z(8.5), new MazeBall.f.Vector3(4, 4, 14)));
            });
            this.startPosition = this.getContainer().mtxLocal.translation;
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
        }
        swapControl() {
            if (MazeBall.playerControl.controlledPlatformTurntable != this.turnTable) {
                MazeBall.playerControl.controlledPlatformTurntable = this.turnTable;
                ComponentPlatform.swapControlAudio.play(true);
            }
        }
    }
    ComponentPlatform.swapControlAudio = new MazeBall.f.ComponentAudio(new MazeBall.f.Audio("./resources/sounds/control_swap.mp3"));
    MazeBall.ComponentPlatform = ComponentPlatform;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
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
            window.addEventListener("load", () => {
                this.clock = document.getElementById("clock");
                this.clock.innerText = "0:00:000";
                MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            });
        }
        requestClickToStart() {
            const message = document.getElementById("message");
            message.className = "blink";
            message.innerText = "click to start";
            MazeBall.canvas.addEventListener("click", this.start);
        }
        finish(_solved = true) {
            if (_solved) {
                const message = document.getElementById("message");
                message.className = "blink";
                message.innerText = "Finished!\nclick to reset";
                MazeBall.canvas.addEventListener("click", this.reset);
            }
            this.isFinished = true;
            this.dispatchEvent(this.eventEnd);
            MazeBall.f.Loop.stop();
        }
    }
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
        // load game settings
        let response = await fetch("./../resources/GameSettings.json");
        MazeBall.gameSettings = await response.json();
        // initialize physics
        MazeBall.f.Physics.initializePhysics();
        MazeBall.f.Physics.settings.debugMode = MazeBall.f.PHYSICS_DEBUGMODE[MazeBall.gameSettings.debugMode];
        MazeBall.f.Physics.settings.debugDraw = MazeBall.gameSettings.debugDraw;
        // setup graph
        MazeBall.scene = MazeBall.f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"];
        MazeBall.scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new MazeBall.ComponentPlatform()));
        MazeBall.scene.getChildrenByName("FinalPlatform")[0].addComponent(new MazeBall.ComponentPlatform(true));
        MazeBall.scene.getChildrenByName("Ball")[0].addComponent(new MazeBall.ComponentBall());
        //scene.getChildrenByName("Platform")[1].getChildrenByName("Wall")[0].addComponent(new ComponentMovingWall(5, 5, f.Vector3.X()));
        MazeBall.f.Debug.log("Scene:", MazeBall.scene);
        // setup player control
        MazeBall.scene.addChild(MazeBall.playerControl);
        MazeBall.playerControl.viewObject = MazeBall.scene.getChildrenByName("Ball")[0];
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", MazeBall.scene, MazeBall.playerControl.camera, MazeBall.canvas);
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
                this.controlledPlatformTurntable = MazeBall.scene.getChildrenByName("TurnTable")[0];
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
            this.addComponent(new MazeBall.f.ComponentTransform(MazeBall.f.Matrix4x4.SCALING(MazeBall.f.Vector3.ONE(0.75))));
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
            this.axisY = this;
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.axisX = new MazeBall.f.Node("AxisX");
            this.axisX.addComponent(new MazeBall.f.ComponentTransform());
            super.addChild(this.axisX);
            this.axisZ = new MazeBall.f.Node("AxisZ");
            this.axisZ.addComponent(new MazeBall.f.ComponentTransform());
            this.axisX.addChild(this.axisZ);
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