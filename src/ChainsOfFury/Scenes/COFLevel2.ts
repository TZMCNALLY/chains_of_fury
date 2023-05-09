import COFLevel, { COFEntities } from "./COFLevel";
import { COFLayers } from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import DarkStalkerController from "../Enemy/DarkStalker/DarkStalkerController";
import COFLevel3 from "./COFLevel3";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { DarkStalkerEvents } from "../Enemy/DarkStalker/DarkStalkerEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import MissleBehavior from "../Enemy/DarkStalker/AttackBehaviors/MissleBehavior";
import { COFEvents } from "../COFEvents";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Timer from "../../Wolfie2D/Timing/Timer";
import MineBehavior from "../Enemy/DarkStalker/AttackBehaviors/MineBehavior";
import EyeballBehavior from "../Enemy/DarkStalker/AttackBehaviors/EyeballBehavior";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MainMenu from "./MainMenu";

export default class COFLevel2 extends COFLevel {

    /** Objects pools for various attacks */
    private mineBalls: Array<AnimatedSprite>;
    private missles: Array<AnimatedSprite>;
    private eyeBalls: Array<AnimatedSprite>;
    private portals: Array<AnimatedSprite>;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {

        let groupNames : string[] = [
            COFPhysicsGroups.PLAYER, 
            COFPhysicsGroups.ENEMY,
            COFPhysicsGroups.ENEMY_CONTACT_DMG,
            COFPhysicsGroups.WALL,
            COFPhysicsGroups.PLAYER_WEAPON,
            COFPhysicsGroups.FIREBALL,
            COFPhysicsGroups.ENEMY_PROJECTILE
        ]
        
        let collisions : number[][] = [
            [0,0,0,1,0,1,1],
            [0,0,0,1,1,1,0],
            [0,0,0,1,1,1,0],
            [1,1,1,0,0,1,0],
            [0,1,1,0,0,0,0],
            [1,1,1,1,0,0,0],
            [1,0,0,0,0,0,0]
        ];


        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames, collisions
        }});
    }


    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("darkstalker", "cof_assets/spritesheets/Enemies/dark_stalker.json");
        this.load.spritesheet("missle", "cof_assets/spritesheets/Projectiles/missle.json");
        this.load.spritesheet("portal", "cof_assets/spritesheets/Spells/portal.json");
        this.load.spritesheet("mine", "cof_assets/spritesheets/Spells/mines.json");
        this.load.spritesheet("eyeball", "cof_assets/spritesheets/Enemies/eyeball.json");
    }

    public startScene(): void {
        super.startScene();
        this.enemyBossName = "Darkstalker"
        this.initializeEnemyBoss("darkstalker", DarkStalkerController, 1, [750, 480], -15, -15);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch(event.type) {
            case DarkStalkerEvents.MINE_EXPLODED: {
                this.explodeMine(event.data.get("node"));
                break;
            }
            case DarkStalkerEvents.TELEPORT: {
                this.handleBossTeleportation(event.data.get("location"));
                break;
            }
            case DarkStalkerEvents.CAST: {
                if ((this.enemyBoss._ai as DarkStalkerController).currMagic == 0) {
                    this.misslePortal();
                } else if ((this.enemyBoss._ai as DarkStalkerController).currMagic == 1) {
                    this.summonEyeballs();
                } else if ((this.enemyBoss._ai as DarkStalkerController).currMagic == 2) {
                    this.spawnMines();
                }
                break;
            }
            case DarkStalkerEvents.EYEBALL_DEAD: {
                this.handleEyeballDeath();
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_WALL: {
                event.data.get("node"); // handles this event, missle despawn by themselves
                break;
            }
            case DarkStalkerEvents.DESPAWN_MISSLE: {
                this.despawnProjectile(event.data.get("node"));
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_PLAYER: {
                // Also play an exploding animation for projectile. 
                this.despawnProjectile(event.data.get("node"));
                break;
            }
            case DarkStalkerEvents.SHOOT_MISSLE: {
                this.shootMissle(event.data.get("origin"), event.data.get("dir"));
                break;
            }
        }
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        MainMenu.boss2Defeated = true;
        this.sceneManager.changeToScene(COFLevel3)
    }

    protected initObjectPools(): void {
        super.initObjectPools();

        this.mineBalls = new Array(12);
        this.missles = new Array(12);
        this.eyeBalls = new Array(4);
        this.portals = new Array(4);

        /** mineBalls and missles initialization */
        for (let i = 0; i < 12; i++) {
            // TODO make a sprite for this!!!
            this.mineBalls[i] = this.add.animatedSprite("mine", COFLayers.PRIMARY);
            this.missles[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            this.mineBalls[i].visible = false; // Turns them off.
            this.missles[i].visible = false;

            // Each mine will have a pre-determined count down to explode.
            this.mineBalls[i].addAI(MineBehavior, {countdown: RandUtils.randFloat(5,9)});
            this.missles[i].addAI(MissleBehavior, {player: this.player});

            // physics group / aabb collision will be handle when they are activated.
        }

        /** portal and eyeBall initialization */
        for (let i = 0; i < 4; i++) {
            // TODO make a sprite for them!!
            this.eyeBalls[i] = this.add.animatedSprite("eyeball", COFLayers.PRIMARY);
            this.portals[i] = this.add.animatedSprite("portal", COFLayers.PRIMARY);

            this.portals[i].scale = new Vec2(1.5,1.5);

            this.eyeBalls[i].addAI(EyeballBehavior, {player: this.player, factory: this.add});

            this.eyeBalls[i].tweens.add("death", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: TweenableProperties.alpha,
                        start: 1,
                        end: 0,
                        ease: EaseFunctionType.OUT_IN_QUAD
                    }
                ],
                onEnd: DarkStalkerEvents.EYEBALL_DEAD
            });
            this.eyeBalls[i].tweens.add("summon", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: TweenableProperties.alpha,
                        start: 0,
                        end: 1,
                        ease: EaseFunctionType.OUT_IN_QUAD
                    }
                ]
            })

            this.portals[i].tweens.add("rotate", {
                startDelay: 0,
                duration: 200,
                effects: [
                    {
                        property: TweenableProperties.rotation,
                        start: 0,
                        end: Math.PI*2,
                        ease: EaseFunctionType.IN_OUT_QUINT,
                    }
                ]
            })

            this.eyeBalls[i].visible = false;
            this.portals[i].visible = false;

            // TODO add AI for eyeball
        }
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();

        this.receiver.subscribe(DarkStalkerEvents.CAST);
        this.receiver.subscribe(DarkStalkerEvents.MINE_EXPLODED);
        this.receiver.subscribe(DarkStalkerEvents.TELEPORT);
        this.receiver.subscribe(DarkStalkerEvents.DESPAWN_MISSLE);
        this.receiver.subscribe(DarkStalkerEvents.EYEBALL_DEAD);
        this.receiver.subscribe(DarkStalkerEvents.SHOOT_MISSLE);
    }

    protected shootMissle(origin: Vec2, dir: Vec2): void {
        for (let i = 0; i < 12; i++) {
            if (!this.missles[i].visible) {
                // Move object to enemy boss position.
                this.missles[i].position.copy(origin);

                // Add physics
                let hitbox = new AABB(
                    this.missles[i].position.clone(),
                    this.missles[i].boundary.getHalfSize().clone()
                );
                this.missles[i].addPhysics(hitbox);
                this.missles[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);

                (this.missles[i]._ai as MissleBehavior).velocity = dir.clone();

                (this.missles[i]._ai as MissleBehavior).reset();
                this.missles[i].visible = true;

                return;
            }
        }
    }

    private misslePortal(): void {
        let timeOffset = 0;

        for (let i = 0; i < 4; i++) {
            let rnd = RandUtils.randInt(50, 80);
            let rndVec = new Vec2(rnd, rnd);
            
            rndVec.rotateCCW(RandUtils.randFloat(0,2)*Math.PI);

            this.portals[i].position.copy(this.enemyBoss.position);
            this.portals[i].position.y += rndVec.y;
            this.portals[i].position.x += rndVec.x;

            this.portals[i].visible = true;
            this.portals[i].animation.play("IDLE");
            this.portals[i].tweens.play("rotate", true);

            let speedVec = new Vec2(150, 150);

            let missleTimer1 = new Timer(timeOffset+RandUtils.randInt(100, 150), () => {
                this.portals[i].animation.play("FIRE", false, DarkStalkerEvents.SHOOT_MISSLE, {
                    origin: this.portals[i].position.clone(), dir: speedVec.clone().rotateCCW(RandUtils.randFloat(0, Math.PI))});
                this.portals[i].animation.queue("IDLE");
                
            });
            let missleTimer2 = new Timer(timeOffset+RandUtils.randInt(500, 550), () => {
                this.portals[i].animation.play("FIRE", false, DarkStalkerEvents.SHOOT_MISSLE, {
                    origin: this.portals[i].position.clone(), dir: speedVec.clone().rotateCCW(RandUtils.randFloat(0, Math.PI))});
                this.portals[i].animation.queue("IDLE");
            });
            let missleTimer3 = new Timer(timeOffset+RandUtils.randInt(900, 1000), () => {
                this.portals[i].animation.play("FIRE", false, DarkStalkerEvents.SHOOT_MISSLE, {
                    origin: this.portals[i].position.clone(), dir: speedVec.clone().rotateCCW(RandUtils.randFloat(0, Math.PI))});
                this.portals[i].animation.queue("IDLE");


                // Despawn this portal after 200ms.
                let despawnTimer = new Timer(400, () => {
                    // Play despawn animation and play an event which destroys the portal??
                    this.despawnProtalSingular(i); // Make this for singular portal
                })
                despawnTimer.start();
            });
            missleTimer1.start();
            missleTimer2.start();
            missleTimer3.start();

            timeOffset += RandUtils.randInt(1500, 3000);
        }
    }

    private summonEyeballs(): void {
        for (let i = 0; i < 4; i++) {
            if (this.eyeBalls[i].visible) {
                continue;
            } else {
                let x = RandUtils.randInt(400, 800);
                let y = RandUtils.randInt(400, 600);

                this.eyeBalls[i].position = new Vec2(x, y);
                let hitbox = new AABB(
                    this.eyeBalls[i].position.clone(),
                    this.eyeBalls[i].boundary.getHalfSize().clone()
                );
                this.eyeBalls[i].addPhysics(hitbox);
                this.eyeBalls[i].setGroup(COFPhysicsGroups.ENEMY);
                this.eyeBalls[i].setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, "");
                (this.eyeBalls[i]._ai as EyeballBehavior).reset();
                this.eyeBalls[i].visible = true;
                this.eyeBalls[i].tweens.play("summon");

                (this.enemyBoss._ai as DarkStalkerController).activeEyes += 1;
            }
        }
    }

    private spawnMines(): void {
        for (let i = 0; i < 12; i++) {
            if (this.mineBalls[i].visible) {
                continue;
            }

            this.mineBalls[i].position.copy(this.enemyBoss.position);
            this.mineBalls[i].scale = new Vec2(1,1);
            
            let hitbox = new AABB(
                this.mineBalls[i].position.clone(),
                this.mineBalls[i].boundary.getHalfSize()
            );

            this.mineBalls[i].addPhysics(hitbox);
            // Since this group have no collision with projectiles and player
            this.mineBalls[i].setGroup(COFPhysicsGroups.ENEMY);

            let rndSpeed = RandUtils.randInt(100, 180);
            let rndDir = new Vec2(rndSpeed, rndSpeed);
            // Random direction to shoot the mine
            (this.mineBalls[i]._ai as MineBehavior).velocity = rndDir.rotateCCW(RandUtils.randFloat(0,2)*Math.PI);

            this.mineBalls[i].visible = true;

            (this.enemyBoss._ai as DarkStalkerController).activeMines += 1;
        }
    }

    /**
     * Handles when player swings.
     * 
     * @param faceDir direction player is facing, -1 for left, 1 for right
     */
    protected handlePlayerSwing(faceDir: number) {
        let playerSwingHitbox = this.player.boundary.getHalfSize().clone();
        playerSwingHitbox.x = playerSwingHitbox.x-16;

        let swingPosition = this.player.position.clone();
        swingPosition.x += faceDir*14;

        // This should loop through all hitable object? and fire event.
        if (this.enemyBoss.collisionShape.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
            this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.enemyBoss.id, entity: COFEntities.BOSS});
        }

        for (let i = 0; i < 4; i++) {
            if (this.eyeBalls[i].boundary.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
                this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.eyeBalls[i].id, entity: COFEntities.MINION});
            }
        }

        for (let i = 0; i < 12; i++) {
            if (this.mineBalls[i].boundary.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
                (this.mineBalls[i]._ai as MineBehavior).exploding = true;
                this.explodeMine(this.mineBalls[i].id);
            }
        }
    }

    private despawnProjectile(node: number): void {
        for (let i = 0; i < 12; i++) {
            if (this.missles[i].id == node) {
                this.missles[i].visible = false;
                this.missles[i].position.copy(Vec2.ZERO);
                return;
            }
        }
        console.log("Project to despawn not found!");
    }

    /** Remove a trigger for projectiles */
    protected initializeTriggers(): void {
        // Add physics to the wall layer
        this.walls.addPhysics();
        this.walls.setGroup(COFPhysicsGroups.WALL);
        this.walls.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_WALL, "");
        // this.walls.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, COFEvents.ENEMY_PROJECTILE_HIT_WALL, "");
        // Allows a trigger to happen when boss charges into the wall.
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_CONTACT_DMG, COFEvents.ENEMY_STUNNED, "");
    }

    private explodeMine(node: number): void {
        for (let i = 0; i < 12; i++) {
            if (this.mineBalls[i].id == node) {
                this.mineBalls[i].animation.playIfNotAlready("EXPLODE");

                this.mineBalls[i].scale = new Vec2(2,2);

                if (this.mineBalls[i].boundary.overlaps(this.player.collisionShape)) {
                    this.emitter.fireEvent(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
                }

                let mineDissappearTimer = new Timer(54, () => {
                    this.mineBalls[i].position.copy(Vec2.ZERO);
                    this.mineBalls[i].visible = false;
                    this.mineBalls[i].animation.stop();

                    (this.enemyBoss._ai as DarkStalkerController).activeMines -= 1;
                    (this.mineBalls[i]._ai as MineBehavior).exploding = false;
                });
                mineDissappearTimer.start();

                return;
            }
        }
        console.log("Mine to be exploded not found!");
    }

    private despawnPortals(): void {
        for (let i = 0; i < 4; i++) {
            this.portals[i].position.copy(Vec2.ZERO);
            this.portals[i].visible = false;
        }
    }

    private despawnProtalSingular(portalIndex: number): void {
        this.portals[portalIndex].position.copy(Vec2.ZERO);
        this.portals[portalIndex].visible = false;
        this.portals[portalIndex].tweens.stopAll();
    }

    protected handleBossTeleportation(location: Vec2): void { 
        this.enemyBoss.position.copy(location);
    }

    private handleEyeballDeath(): void {
        for (let i = 0; i < 4; i++) {
            if ((this.eyeBalls[i]._ai as EyeballBehavior).health <= 0 && this.eyeBalls[i].visible) {
                this.eyeBalls[i].visible = false;
                this.eyeBalls[i].animation.stop();
            }
        }
    }
}