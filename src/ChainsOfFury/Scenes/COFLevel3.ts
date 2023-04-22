import COFLevel from "./COFLevel";
import COFLevel4 from "./COFLevel4"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MindFlayerController from "../Enemy/MindFlayer/MindFlayerController";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { MindFlayerEvents } from "../Enemy/MindFlayer/MindFlayerEvents";
import { COFLayers } from "./COFLevel";
import FireballBehavior from "../Fireball/FireballBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../COFEvents";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import EnemyController from "../Enemy/EnemyController";


export default class COFLevel3 extends COFLevel {

    /** Object pool for fire projectiles */
    private bossFireballs: Array<AnimatedSprite>;

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("mind_flayer", "cof_assets/spritesheets/mind_flayer.json");
        this.load.spritesheet("shadow_demon", "cof_assets/spritesheets/shadow_demon.json")
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Mind Flayer");
        this.initializeEnemyBoss("mind_flayer", MindFlayerController, 0.35, [700, 700]);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel4)
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case MindFlayerEvents.MIND_FLAYER_TELEPORT: {
                this.handleBossTeleportation(event.data.get("location"));
                break;
            }
            case MindFlayerEvents.MIND_FLAYER_FIRE_FIREBALL: {
                this.spawnEnemyFireball(event.data.get("faceDir"));
                break;
            }
            case MindFlayerEvents.MIND_FLAYER_FIREBALL_HIT_WALL: {
                this.despawnEnemyFireballs(event.data.get("node"));
                break;
            }
            case MindFlayerEvents.MIND_FLAYER_SUMMON_SHADOW_DEMON: {
                this.summonShadowDemon(event.data.get("location"));
                break;
            }
            case COFEvents.PLAYER_HIT: {
                this.despawnEnemyFireballs(event.data.get("node"));
                break;
            }
        }
    }

    protected initObjectPools(): void {
		super.initObjectPools();
		// Init boss fireball object pool
		this.bossFireballs = new Array(5);
		for (let i = 0; i < this.bossFireballs.length; i++) {
			this.bossFireballs[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            // Make our fireballs inactive by default
			this.bossFireballs[i].visible = false;

			// Assign them fireball ai
			this.bossFireballs[i].addAI(FireballBehavior);

            this.bossFireballs[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
			this.bossFireballs[i].scale.set(1.5, 1.5);
	    }
    }

    protected initializeTilemap(): void {
        super.initializeTilemap();
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, MindFlayerEvents.MIND_FLAYER_FIREBALL_HIT_WALL, null);
    }
    
    /**
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the fireball should go
    */
    protected spawnEnemyFireball(faceDir: Vec2) {
        for(let i = 0; i < this.bossFireballs.length; i++) {

            if(!this.bossFireballs[i].visible) {

                // Bring this fireball to life
                this.bossFireballs[i].visible = true;

                // Set the velocity
                faceDir.x *= 400;
                faceDir.y *= 400;

                (this.bossFireballs[i]._ai as FireballBehavior).velocity = faceDir

                // Set the starting position of the fireball
                this.bossFireballs[i].position.copy(this.enemyBoss.position);

                // Give physics to this fireball
                let fireballHitbox = new AABB(this.enemyBoss.position.clone(), this.bossFireballs[i].boundary.getHalfSize().clone());
                this.bossFireballs[i].addPhysics(fireballHitbox);
                this.bossFireballs[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);

                break;
            }
        }
    }

    protected despawnEnemyFireballs(node: number) : void {
        for(let i = 0; i < this.bossFireballs.length; i++) {
            if(this.bossFireballs[i].id == node) {
                this.bossFireballs[i].position.copy(Vec2.ZERO);
                this.bossFireballs[i].visible = false;
                break;
            }
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_TELEPORT);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_FIRE_FIREBALL);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_FIREBALL_HIT_WALL);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_SUMMON_SHADOW_DEMON);
    }

    protected handleBossTeleportation(location: Vec2): void { 
        this.enemyBoss.position.copy(location);
    }

    // protected initializeShadowDemon(key: string, controller: new (...a: any[]) => EnemyController, scaleSize: number): void {
    //     let enemySpawn = new Vec2(500,500);

    //     this.enemyBoss = this.add.animatedSprite(key, COFLayers.PRIMARY);
    //     this.enemyBoss.scale.set(scaleSize, scaleSize);
    //     this.enemyBoss.position.copy(enemySpawn);
    //     this.enemyBoss.addAI(controller, {player: this.player});

    //     let enemyHitbox = this.enemyBoss.boundary.getHalfSize().clone();
    //     enemyHitbox.x = enemyHitbox.x - 6;

    //     //this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), enemyHitbox));
    //     this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x-15, this.enemyBoss.boundary.getHalfSize().clone().y-15)));
    //     this.enemyBoss.setGroup(COFPhysicsGroups.ENEMY);
    //     this.enemyBoss.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, null);
    // }

    protected summonShadowDemon(location: Vec2): void {

    }
}