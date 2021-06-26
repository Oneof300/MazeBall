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
        get node() {
            return this.getContainer();
        }
    }
    MazeBallScripts.ComponentScript = ComponentScript;
})(MazeBallScripts || (MazeBallScripts = {}));
///<reference path="scripts/ComponentScript.ts"/>
var MazeBallScripts;
(function (MazeBallScripts) {
    class ComponentBall extends MazeBallScripts.ComponentScript {
        constructor() {
            super(...arguments);
            this.onGameReset = (_event) => {
                this.#body.setVelocity(MazeBallScripts.f.Vector3.ZERO());
                this.#body.setAngularVelocity(MazeBallScripts.f.Vector3.ZERO());
                this.#body.setPosition(MazeBallScripts.f.Vector3.Y(3));
            };
            this.onCollision = (_event) => {
                if (this.#audioBallHit) {
                    this.#audioBallHit.volume = this.#body.getVelocity().magnitude * 0.25;
                    this.#audioBallHit.play(true);
                }
            };
        }
        #body;
        #audioBallHit;
        onAdded(_event) {
            this.#body = this.node.getComponent(MazeBallScripts.f.ComponentRigidbody);
            if (!this.#body) {
                this.#body = new MazeBallScripts.f.ComponentRigidbody(MazeBall.gameSettings.ballMass, MazeBallScripts.f.PHYSICS_TYPE.DYNAMIC, MazeBallScripts.f.COLLIDER_TYPE.SPHERE);
                this.node.addComponent(this.#body);
            }
            this.#audioBallHit = this.node.getComponent(MazeBallScripts.f.ComponentAudio);
            if (!this.#audioBallHit) {
                const audio = MazeBall.getResourceByName("AudioBallHit");
                if (audio) {
                    this.#audioBallHit = new MazeBallScripts.f.ComponentAudio(audio);
                    this.node.addComponent(this.#audioBallHit);
                }
            }
            this.#body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
        }
    }
    MazeBallScripts.ComponentBall = ComponentBall;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBallScripts;
(function (MazeBallScripts) {
    class ComponentCannon extends MazeBallScripts.ComponentScript {
        constructor(_range = 1) {
            super();
            this.#ballWasInSight = false;
            this.onGameStart = (_event) => {
                MazeBallScripts.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            };
            this.onGameEnd = (_event) => {
                MazeBallScripts.f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            };
            this.update = (_event) => {
                const mtxWorld = this.node.mtxWorld;
                const differenceToBall = MazeBallScripts.f.Vector3.DIFFERENCE(mtxWorld.translation, this.ball.translation);
                const forward = mtxWorld.getZ();
                const ballInSight = differenceToBall.magnitude < this.range && MazeBallScripts.f.Vector3.DOT(MazeBallScripts.f.Vector3.NORMALIZATION(differenceToBall), forward) < -0.975;
                if (ballInSight && !this.#ballWasInSight)
                    this.fire();
                this.#ballWasInSight = ballInSight;
            };
            this.singleton = true;
            this.range = _range;
        }
        #projectile;
        #ball;
        #ballWasInSight;
        get ball() {
            if (!this.#ball)
                this.#ball = this.node.getAncestor().getChildrenByName("Ball")[0].mtxWorld;
            return this.#ball;
        }
        onAdded(_event) {
            this.#projectile = new MazeBall.Projectile(this.node.getComponent(MazeBallScripts.f.ComponentMaterial).material);
            this.node.addChild(this.#projectile);
            // Lazy Pattern everywhere?
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, this.onGameStart);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.END, this.onGameEnd);
        }
        fire() {
            console.log("fire");
            // calculate start position and force for the projectile to fire
            const cannonPos = this.node.mtxWorld.translation;
            const forward = this.node.mtxWorld.getZ();
            const distanceToTarget = MazeBallScripts.f.Vector3.DIFFERENCE(cannonPos, this.ball.translation).magnitude;
            const projectileStartPos = MazeBallScripts.f.Vector3.SUM(cannonPos, MazeBallScripts.f.Vector3.SCALE(forward, 1));
            const force = MazeBallScripts.f.Vector3.SCALE(forward, (10 - 10 / distanceToTarget) * MazeBall.gameSettings.cannonStrength);
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
                const mtxLocal = this.node.mtxLocal;
                mtxLocal.translate(MazeBallScripts.f.Vector3.DIFFERENCE(this.#startPos, mtxLocal.translation));
            };
            this.update = (_event) => {
                const mtxLocal = this.node.mtxLocal;
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
            this.#center = MazeBallScripts.f.Vector3.SUM(this.node.mtxLocal.translation, MazeBallScripts.f.Vector3.SCALE(this.movement, 0.5));
            this.#range = this.movement.magnitude / 2;
            this.#dir = MazeBallScripts.f.Vector3.NORMALIZATION(this.movement);
            MazeBallScripts.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        onAdded(_event) {
            this.#startPos = this.node.mtxLocal.translation;
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onGameReset);
            if (this.loop) {
                MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, () => this.start());
                MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, () => MazeBallScripts.f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update));
            }
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
                    this.node.removeEventListener("childAppend" /* CHILD_APPEND */, this.onChildAppend);
                    if (!this.isFinal) {
                        // Append turn table
                        this.#turnTable = new MazeBall.TurnTable();
                        this.node.getParent().addChild(this.#turnTable);
                        this.#turnTable.mtxLocal.translate(this.node.mtxLocal.translation);
                        this.node.mtxLocal.set(MazeBallScripts.f.Matrix4x4.ROTATION(this.node.mtxLocal.rotation));
                        this.#turnTable.addChild(this.node);
                    }
                    this.addRigidBodies();
                }
            };
            this.onFloorCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball") {
                    if (this.isFinal)
                        MazeBall.game.end();
                    else
                        this.swapControl();
                }
            };
            this.singleton = true;
            this.isFinal = _final;
        }
        #turnTable;
        onAdded(_event) {
            this.node.addEventListener("childAppend" /* CHILD_APPEND */, this.onChildAppend);
        }
        addRigidBodies() {
            this.node.getChildren().forEach(child => {
                let body = child.getComponent(MazeBallScripts.f.ComponentRigidbody);
                if (!body) {
                    body = new MazeBallScripts.f.ComponentRigidbody(0, MazeBallScripts.f.PHYSICS_TYPE.KINEMATIC, MazeBallScripts.f.COLLIDER_TYPE.CUBE);
                    child.addComponent(body);
                }
                if (child.name == "Floor")
                    body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onFloorCollisionEnter);
            });
        }
        swapControl() {
            MazeBall.playerControl.controlledPlatformTurntable = this.#turnTable;
        }
    }
    MazeBallScripts.ComponentPlatform = ComponentPlatform;
})(MazeBallScripts || (MazeBallScripts = {}));
var MazeBall;
(function (MazeBall) {
    MazeBall.f = FudgeCore;
    let EVENT_GAME;
    (function (EVENT_GAME) {
        EVENT_GAME["START"] = "gamestart";
        EVENT_GAME["END"] = "gameend";
        EVENT_GAME["RESET"] = "gamereset";
        EVENT_GAME["SOLVED"] = "gamesolved";
    })(EVENT_GAME = MazeBall.EVENT_GAME || (MazeBall.EVENT_GAME = {}));
    class Game extends EventTarget {
        constructor() {
            super();
            this.#isRunning = false;
            this.eventStart = new Event(EVENT_GAME.START);
            this.eventEnd = new Event(EVENT_GAME.END);
            this.eventReset = new Event(EVENT_GAME.RESET);
            this.eventSolved = new Event(EVENT_GAME.SOLVED);
            this.start = () => {
                this.#isRunning = false;
                this.message.hidden = true;
                MazeBall.canvas.removeEventListener("click", this.start);
                MazeBall.canvas.requestPointerLock();
                this.dispatchEvent(this.eventStart);
                MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.gameSettings.fps);
                MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            };
            this.update = () => {
                const millisPassed = MazeBall.f.Time.game.get() - MazeBall.f.Loop.timeStartReal;
                const timePassed = new Date(millisPassed > 0 ? millisPassed : 0);
                this.clock.innerText
                    = `${timePassed.getMinutes()}:${timePassed.getSeconds().toLocaleString("en", { minimumIntegerDigits: 2 })}:`
                        + timePassed.getMilliseconds().toLocaleString("en", { minimumIntegerDigits: 3 });
            };
            this.onKeyDown = (_event) => {
                if (_event.code == MazeBall.f.KEYBOARD_CODE.ESC) {
                    console.log("esc");
                    if (this.finishedDialog.hidden)
                        this.menu.hidden = !this.menu.hidden;
                }
            };
            this.onFinishedDialogKeyDown = (_event) => {
                if (_event.code == MazeBall.f.KEYBOARD_CODE.ENTER) {
                    this.registerHighscore();
                    this.finishedDialog.hidden = true;
                    this.reset();
                    this.finishedDialog.removeEventListener("keydown", this.onFinishedDialogKeyDown);
                }
            };
            window.addEventListener("keydown", this.onKeyDown);
        }
        #isRunning;
        #message;
        #clock;
        #finishedDialog;
        #nameInput;
        #time;
        #menu;
        get isRunning() {
            return this.#isRunning;
        }
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
        get finishedDialog() {
            if (!this.#finishedDialog)
                this.#finishedDialog = document.getElementById("finished_dialog");
            return this.#finishedDialog;
        }
        get nameInput() {
            if (!this.#nameInput)
                this.#nameInput = document.getElementById("name");
            return this.#nameInput;
        }
        get time() {
            if (!this.#time)
                this.#time = document.getElementById("time");
            return this.#time;
        }
        get menu() {
            if (!this.#menu)
                this.#menu = document.getElementById("menu");
            return this.#menu;
        }
        requestClickToStart() {
            this.message.hidden = false;
            this.message.innerText = "click to start";
            MazeBall.canvas.addEventListener("click", this.start);
        }
        end(_solved = true) {
            this.#isRunning = false;
            this.dispatchEvent(this.eventEnd);
            MazeBall.f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            MazeBall.f.Loop.stop();
            if (_solved) {
                this.dispatchEvent(this.eventSolved);
                this.time.innerText = this.clock.innerText;
                this.finishedDialog.hidden = false;
                this.nameInput.focus();
                this.finishedDialog.addEventListener("keydown", this.onFinishedDialogKeyDown);
            }
        }
        reset() {
            if (this.isRunning)
                this.end(false);
            else
                MazeBall.canvas.removeEventListener("click", this.reset);
            this.dispatchEvent(this.eventReset);
            this.clock.innerText = "0:00:000";
            this.requestClickToStart();
            MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, MazeBall.gameSettings.fps);
        }
        async registerHighscore() {
            const path = "https://sftp.hs-furtwangen.de/~romingma/PRIMA/json_request.php";
            // get highscores
            const reponse = await fetch(path);
            const json = await reponse.json();
            const highscores = Array.from(Object.entries(json));
            // add highscore
            const existingScore = highscores.find(entry => entry[0] == this.nameInput.value);
            if (existingScore) {
                if (existingScore[1].localeCompare(this.time.innerText) > 0)
                    existingScore[1] = this.time.innerText;
            }
            else
                highscores.push([this.nameInput.value, this.time.innerText]);
            console.log(highscores);
            // update highscores
            const params = highscores.map(entry => `${entry[0]}=${entry[1]}`).join("&");
            await fetch(`${path}?${params}`);
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
        MazeBall.f.Physics.initializePhysics();
        // load game settings
        const response = await fetch("./resources/GameSettings.json");
        MazeBall.gameSettings = await response.json();
        MazeBall.f.Physics.settings.debugMode = MazeBall.gameSettings.debugMode;
        MazeBall.f.Physics.settings.debugDraw = MazeBall.gameSettings.debugDraw;
        // load scene
        await MazeBall.f.Project.loadResources("./resources/Scene.json");
        const scene = getResourceByName("Scene");
        MazeBall.f.Debug.log("Scene:", scene);
        // setup player control
        MazeBall.playerControl.viewObject = scene.getChildrenByName("Ball")[0];
        scene.addChild(MazeBall.playerControl);
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", scene, MazeBall.playerControl.camera, MazeBall.canvas);
        MazeBall.f.Debug.log("Viewport:", viewport);
        // setup audio
        let cmpListener = new MazeBall.f.ComponentAudioListener();
        MazeBall.playerControl.addComponent(cmpListener);
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
    function getResourceByName(_name) {
        for (const resourceID in MazeBall.f.Project.resources) {
            if (MazeBall.f.Project.resources[resourceID].name == _name)
                return MazeBall.f.Project.resources[resourceID];
        }
        return null;
    }
    MazeBall.getResourceByName = getResourceByName;
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
                window.addEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.addEventListener("mousemove", this.onMouseMove);
                MazeBall.canvas.addEventListener("wheel", this.onWheel);
            };
            this.onGameEnd = (_event) => {
                window.removeEventListener("keydown", this.onKeyboardDown);
                MazeBall.canvas.removeEventListener("mousemove", this.onMouseMove);
                MazeBall.canvas.removeEventListener("wheel", this.onWheel);
            };
            this.onGameSolved = (_event) => {
                this.audioFinish?.play(true);
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
                const forward = this.turnTable.mtxLocal.getZ();
                this.controlledPlatformTurntable.rotateX((forward.x * _event.movementX - forward.z * _event.movementY) * MazeBall.gameSettings.tiltSpeed);
                this.controlledPlatformTurntable.rotateZ((forward.x * _event.movementY + forward.z * _event.movementX) * MazeBall.gameSettings.tiltSpeed);
            };
            this.onWheel = (_event) => {
                this.controlledPlatformTurntable.rotateY(_event.deltaY * MazeBall.gameSettings.rotateSpeed);
            };
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.turnTable = new MazeBall.f.Node("Camera");
            this.turnTable.addComponent(new MazeBall.f.ComponentTransform());
            this.camera = new MazeBall.f.ComponentCamera();
            this.camera.mtxPivot.translateY(30);
            this.camera.mtxPivot.translateZ(-30);
            this.camera.mtxPivot.rotateX(45);
            this.camera.clrBackground = MazeBall.f.Color.CSS("DeepSkyBlue");
            this.turnTable.addComponent(this.camera);
            this.addChild(this.turnTable);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.START, this.onGameStart);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.END, this.onGameEnd);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.SOLVED, this.onGameSolved);
            MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        #controlledPlatformTurntable;
        #audioControlSwap;
        #audioFinish;
        get controlledPlatformTurntable() {
            return this.#controlledPlatformTurntable;
        }
        set controlledPlatformTurntable(_value) {
            if (_value != this.#controlledPlatformTurntable) {
                this.#controlledPlatformTurntable = _value;
                this.audioControlSwap?.play(true);
            }
        }
        get audioControlSwap() {
            if (!this.#audioControlSwap) {
                const audio = MazeBall.getResourceByName("AudioControlSwap");
                if (audio) {
                    this.#audioControlSwap = new MazeBall.f.ComponentAudio(audio);
                    this.#audioControlSwap.volume = 1;
                    this.addComponent(this.#audioControlSwap);
                }
            }
            return this.#audioControlSwap;
        }
        get audioFinish() {
            if (!this.#audioFinish) {
                const audio = MazeBall.getResourceByName("AudioFinish");
                if (audio) {
                    this.#audioFinish = new MazeBall.f.ComponentAudio(audio);
                    this.#audioFinish.volume = 0.5;
                    this.addComponent(this.#audioFinish);
                }
            }
            return this.#audioFinish;
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
        constructor(_material) {
            super("Projectile");
            this.onReset = (_event) => {
                this.body.setPosition(MazeBall.f.Vector3.Y(-1));
                this.body.physicsType = MazeBall.f.PHYSICS_TYPE.STATIC;
                this.activate(false);
            };
            this.addComponent(new MazeBall.f.ComponentMesh(MazeBall.f.Project.resources["MeshSphere|2021-05-25T15:26:35.712Z|33287"]));
            const material = new MazeBall.f.ComponentMaterial(_material);
            this.addComponent(material);
            this.addComponent(new MazeBall.f.ComponentTransform());
            this.mtxLocal.scale(MazeBall.f.Vector3.ONE(0.75));
            this.mtxLocal.translateY(-1);
            this.body = new MazeBall.f.ComponentRigidbody(MazeBall.gameSettings.projectileMass, MazeBall.f.PHYSICS_TYPE.STATIC, MazeBall.f.COLLIDER_TYPE.SPHERE, MazeBall.f.PHYSICS_GROUP.DEFAULT, this.mtxLocal);
            this.addComponent(this.body);
            this.activate(false);
            MazeBall.game.addEventListener(MazeBall.EVENT_GAME.RESET, this.onReset);
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
            let newAngle = _angleInDegrees + axis.rotation.x;
            newAngle = newAngle > 0 ? Math.min(newAngle, MazeBall.gameSettings.tiltMax) : Math.max(newAngle, -MazeBall.gameSettings.tiltMax);
            axis.rotateX(newAngle - axis.rotation.x);
        }
        rotateY(_angleInDegrees) {
            this.axisY.mtxLocal.rotateY(_angleInDegrees);
        }
        rotateZ(_angleInDegrees) {
            const axis = this.axisZ.mtxLocal;
            let newAngle = _angleInDegrees + axis.rotation.z;
            newAngle = newAngle > 0 ? Math.min(newAngle, MazeBall.gameSettings.tiltMax) : Math.max(newAngle, -MazeBall.gameSettings.tiltMax);
            axis.rotateZ(newAngle - axis.rotation.z);
        }
    }
    MazeBall.TurnTable = TurnTable;
})(MazeBall || (MazeBall = {}));
//# sourceMappingURL=MazeBall.js.map