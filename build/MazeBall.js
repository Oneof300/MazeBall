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
///<reference path="ComponentScript.ts"/>
var MazeBall;
///<reference path="ComponentScript.ts"/>
(function (MazeBall) {
    class ComponentBall extends MazeBall.ComponentScript {
        constructor() {
            super(...arguments);
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
        constructor() {
            super();
            this.onCollisionEnter = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "Ball")
                    this.swapControl();
            };
            this.singleton = true;
        }
        onAdded(_event) {
            let node = this.getContainer();
            node.getChildrenByName("Floor").forEach(floor => {
                let body = new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE);
                body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollisionEnter);
                floor.addComponent(body);
            });
            node.getChildrenByName("Wall").forEach(wall => {
                wall.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
            });
            node.getChildrenByName("Cannon").forEach(cannon => {
                cannon.addComponent(new MazeBall.f.ComponentRigidbody(0, MazeBall.f.PHYSICS_TYPE.KINEMATIC, MazeBall.f.COLLIDER_TYPE.CUBE));
                cannon.addComponent(new MazeBall.ComponentCannon(MazeBall.f.Vector3.Z(6), new MazeBall.f.Vector3(5, 10, 5)));
            });
        }
        swapControl() {
            if (MazeBall.controlledPlatform != this.getContainer().mtxLocal) {
                MazeBall.controlledPlatform = this.getContainer().mtxLocal;
                ComponentPlatform.swapControlAudio.play(true);
            }
        }
    }
    ComponentPlatform.swapControlAudio = new MazeBall.f.ComponentAudio(new MazeBall.f.Audio("./resources/sounds/control_swap.mp3"));
    MazeBall.ComponentPlatform = ComponentPlatform;
})(MazeBall || (MazeBall = {}));
var MazeBall;
(function (MazeBall) {
    let viewport;
    let canvas;
    let scene;
    window.addEventListener("load", init);
    async function init() {
        canvas = document.querySelector("canvas");
        // load resources referenced in the link-tag
        await MazeBall.f.Project.loadResources("./resources/Scene.json");
        MazeBall.f.Debug.log("Project:", MazeBall.f.Project.resources);
        // initialize physics
        MazeBall.f.Physics.initializePhysics();
        MazeBall.f.Physics.settings.debugMode = MazeBall.f.PHYSICS_DEBUGMODE.COLLIDERS;
        MazeBall.f.Physics.settings.debugDraw = true;
        // setup graph
        scene = MazeBall.f.Project.resources["Graph|2021-05-25T15:28:57.816Z|73244"];
        scene.getChildrenByName("Platform").forEach(platform => platform.addComponent(new MazeBall.ComponentPlatform()));
        scene.getChildrenByName("Ball")[0].addComponent(new MazeBall.ComponentBall());
        scene.getChildrenByName("Platform")[1].getChildrenByName("Wall")[0].addComponent(new MazeBall.ComponentMovingWall(5, 5, MazeBall.f.Vector3.X()));
        MazeBall.f.Debug.log("Scene:", scene);
        // setup camera
        let camera = new MazeBall.f.ComponentCamera();
        camera.mtxPivot.translateX(10);
        camera.mtxPivot.translateY(25);
        camera.mtxPivot.translateZ(28);
        camera.mtxPivot.rotateY(180);
        camera.mtxPivot.rotateX(45);
        // setup viewport
        viewport = new MazeBall.f.Viewport();
        viewport.initialize("Viewport", scene, camera, canvas);
        MazeBall.f.Debug.log("Viewport:", viewport);
        // setup audio
        scene.addComponent(MazeBall.ComponentPlatform.swapControlAudio);
        let cmpListener = new MazeBall.f.ComponentAudioListener();
        scene.addComponent(cmpListener);
        MazeBall.f.AudioManager.default.listenWith(cmpListener);
        MazeBall.f.AudioManager.default.listenTo(scene);
        MazeBall.f.Debug.log("Audio:", MazeBall.f.AudioManager.default);
        // setup controll
        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
            canvas.addEventListener("mousemove", handleMouse);
            canvas.addEventListener("wheel", handleWheel);
        });
        // start game
        MazeBall.f.Physics.adjustTransforms(scene, true);
        viewport.draw();
        MazeBall.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        MazeBall.f.Loop.start(MazeBall.f.LOOP_MODE.TIME_REAL, 120);
    }
    function update() {
        MazeBall.f.Physics.world.simulate(MazeBall.f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
    function handleMouse(_event) {
        MazeBall.controlledPlatform.rotateX(_event.movementY * 0.05);
        MazeBall.controlledPlatform.rotateZ(_event.movementX * -0.05);
    }
    function handleWheel(_event) {
        MazeBall.controlledPlatform.rotateY(_event.deltaY * 0.05);
    }
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