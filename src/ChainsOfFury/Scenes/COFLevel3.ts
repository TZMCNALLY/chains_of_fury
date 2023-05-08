import COFLevel from "./COFLevel";
import COFLevel4 from "./COFLevel4"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MindFlayerController from "../Enemy/MindFlayer/MindFlayerController";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { MindFlayerEvents } from "../Enemy/MindFlayer/MindFlayerEvents";
import { COFEntities, COFLayers } from "./COFLevel";
import FireballBehavior from "../Fireball/FireballBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { COFEvents } from "../COFEvents";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import ShadowDemonController from "../Enemy/MindFlayer/MindFlayerSummons/ShadowDemon/ShadowDemonController";
import { ShadowDemonEvents } from "../Enemy/MindFlayer/MindFlayerSummons/ShadowDemon/ShadowDemonEvents";
import { DemonSummoningCircleEvents } from "../Spells/DemonSummonCircle/DemonSummoningCircleEvents";
import DemonSummoningCircleBehavior from "../Spells/DemonSummonCircle/DemonSummoningCircleBehavior";
import MainMenu from "./MainMenu";
import IceMirrorBehavior from "../Spells/IceMirror/IceMirrorBehavior";
import { IceMirrorEvents } from "../Spells/IceMirror/IceMirrorEvents";
import SnowballBehavior, { SnowballStates } from "../Spells/Snowball/SnowballBehavior";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import { SpellEffects } from "../Spells/SpellEffects";
import { SnowballEvents } from "../Spells/Snowball/SnowballEvents";

export const HitEntity = {
    PLAYER: "HIT_PLAYER",
    WALL: "HIT_WALL"
} as const

export default class COFLevel3 extends COFLevel {

    /** Object pool for fire projectiles */
    private bossFireballs: Array<AnimatedSprite>;
    /** Object pool for shadow demons */
    private shadowDemons: Array<AnimatedSprite> = new Array(5);
    private shadowDemonFireballs: AnimatedSprite[][] = new Array(5);
    /** Object pool for shadow demon summoning circles */
    private demonSummoningCircles: Array<AnimatedSprite> = new Array(5);
    /** Object pool for ice mirrors */
    private iceMirrors: Array<AnimatedSprite> = new Array(1);
    /** Object pool for snowballs */
    private snowballs: Array<AnimatedSprite> = new Array(1);

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("mind_flayer", "cof_assets/spritesheets/Enemies/mind_flayer.json");
        this.load.spritesheet("shadow_demon", "cof_assets/spritesheets/Enemies/shadow_demon.json")
        this.load.spritesheet("demon_summoning_circle", "cof_assets/spritesheets/Spells/demon_summoning_circle.json");
        this.load.spritesheet("ice_mirror", "cof_assets/spritesheets/Spells/ice_mirror.json");
        this.load.spritesheet("snowball", "cof_assets/spritesheets/Spells/snowball.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Lord Reyalf");
        this.initializeEnemyBoss("mind_flayer", MindFlayerController, 0.35, [750, 480], -5, -5);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        MainMenu.boss3Defeated = true;
        this.sceneManager.changeToScene(COFLevel4);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_TELEPORT);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_FIRE_FIREBALL);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_SPAWN_ICE_MIRROR);
        this.receiver.subscribe(MindFlayerEvents.MIND_FLAYER_SPAWN_DEMON_CIRCLE);
        this.receiver.subscribe(ShadowDemonEvents.SHADOW_DEMON_FIRE_FIREBALL);
        this.receiver.subscribe(ShadowDemonEvents.FIREBALL_HIT_SHADOW_DEMON);
        this.receiver.subscribe(ShadowDemonEvents.SHADOW_DEMON_SWIPE);
        this.receiver.subscribe(DemonSummoningCircleEvents.SPAWN_CIRCLE);
        this.receiver.subscribe(DemonSummoningCircleEvents.SUMMON_SHADOW_DEMON);
        this.receiver.subscribe(DemonSummoningCircleEvents.DESPAWN_CIRCLE);
        this.receiver.subscribe(IceMirrorEvents.DESPAWN_MIRROR);
        this.receiver.subscribe(IceMirrorEvents.SPAWN_SNOWBALL);
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
                this.spawnBossFireball(event.data.get("faceDir"));
                break;
            }
            case MindFlayerEvents.MIND_FLAYER_SPAWN_ICE_MIRROR: {
                this.spawnIceMirror(event.data.get("location"));
                break;
            }
            case IceMirrorEvents.DESPAWN_MIRROR: {
                this.despawnIceMirror(event.data.get("id"));
                break;
            }
            case IceMirrorEvents.SPAWN_SNOWBALL: {
                this.spawnSnowball(event.data.get("location"));
                break;
            }
            case DemonSummoningCircleEvents.SPAWN_CIRCLE: {
                this.spawnDemonCircle(event.data.get("location"));
                break;
            }
            case DemonSummoningCircleEvents.SUMMON_SHADOW_DEMON: {
                this.spawnShadowDemon(event.data.get("location"));
                break;
            }
            case DemonSummoningCircleEvents.DESPAWN_CIRCLE: {
                this.despawnDemonCircle(event.data.get("id"));
                break;
            }
            case ShadowDemonEvents.SHADOW_DEMON_FIRE_FIREBALL: {
                this.spawnShadowDemonFireball(event.data.get("faceDir"), event.data.get("id"));
                break;
            }
            case ShadowDemonEvents.FIREBALL_HIT_SHADOW_DEMON: {
                this.handleFireballHitShadowDemon(event.data.get("other"), COFEntities.MINION);
                this.despawnFireballs(event.data.get("node"));
                break;
            }
            case ShadowDemonEvents.SHADOW_DEMON_SWIPE: {
                this.handleShadowDemonSwipe(event.data.get("id"), event.data.get("direction"));
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_WALL: {
                this.despawnBossFireball(event.data.get("node"));
                this.despawnShadowDemonFireball(event.data.get("node"));
                this.despawnSnowball(event.data.get("node"), HitEntity.WALL);
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_PLAYER: {
                this.despawnBossFireball(event.data.get("node"));
                this.despawnShadowDemonFireball(event.data.get("node"));
                this.despawnSnowball(event.data.get("node"), HitEntity.PLAYER);
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

        for (let i = 0; i < this.shadowDemons.length; i++) {
            this.shadowDemons[i] = this.add.animatedSprite("shadow_demon", COFLayers.PRIMARY);
            this.shadowDemons[i].scale.set(0.6, 0.6);
            this.shadowDemons[i].position.copy(new Vec2(0,0));
            this.shadowDemons[i].visible = false;

            /** Init shadow demon object pools */
            this.shadowDemonFireballs[i] = new Array(3);
		    for (let j = 0; j < this.shadowDemonFireballs[i].length; j++) {
                this.shadowDemonFireballs[i][j] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

                // Make our fireballs inactive by default
                this.shadowDemonFireballs[i][j].visible = false;

                // Assign them fireball ai
                this.shadowDemonFireballs[i][j].addAI(FireballBehavior);

                this.shadowDemonFireballs[i][j].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
                this.shadowDemonFireballs[i][j].scale.set(1.5, 1.5);
            }
        }

        for (let i = 0; i < this.demonSummoningCircles.length; i++) {
            this.demonSummoningCircles[i] = this.add.animatedSprite("demon_summoning_circle", COFLayers.PRIMARY);

			this.demonSummoningCircles[i].visible = false;
            
            this.demonSummoningCircles[i].scale.set(1.5, 1.5);
        }

        for (let i = 0; i < this.iceMirrors.length; i++) {
            this.iceMirrors[i] = this.add.animatedSprite("ice_mirror", COFLayers.PRIMARY);

			this.iceMirrors[i].visible = false;
            
            this.iceMirrors[i].scale.set(1.5, 1.5);
        }

        for (let i = 0; i < this.snowballs.length; i++) {
            this.snowballs[i] = this.add.animatedSprite("snowball", COFLayers.PRIMARY);

			this.snowballs[i].visible = false;

            this.snowballs[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
            this.snowballs[i].scale.set(2, 2);
        }
    }
    
    /**
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the fireball should go
    */
    protected spawnBossFireball(faceDir: Vec2) {
        for (let i = 0; i < this.bossFireballs.length; i++) {

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

    protected despawnBossFireball(node: number) : void {
        for (let i = 0; i < this.bossFireballs.length; i++) {
            if (this.bossFireballs[i].id === node) {
                this.bossFireballs[i].position.copy(Vec2.ZERO);
                this.bossFireballs[i].visible = false;
                break;
            }
        }
    }

    protected spawnIceMirror(location: Vec2) {
        for (let i = 0; i < this.iceMirrors.length; i++) {
            if (!this.iceMirrors[i].visible) {
                this.iceMirrors[i].visible = true;

                this.iceMirrors[i].position.copy(location);
                this.iceMirrors[i].addAI(IceMirrorBehavior);

                (this.iceMirrors[i]._ai as IceMirrorBehavior).location = location;
                break;
            }
        }
    }

    protected despawnIceMirror(id: number) {
        for (let i = 0; i < this.iceMirrors.length; i++) {
            if (this.iceMirrors[i].id === id) {
                this.iceMirrors[i].position.copy(Vec2.ZERO);
                this.iceMirrors[i].visible = false;
                break;
            }
        }
    }

    /**
    * Displays a snowball on the map
    * 
    * @param location the spawn point of the snowball
    */
    protected spawnSnowball(location: Vec2) {
        for (let i = 0; i < this.snowballs.length; i++) {

            if (!this.snowballs[i].visible) {
                this.snowballs[i].visible = true;

                let dir = location.dirTo(this.player.position);

                // Set the velocity
                dir.x *= 400;
                dir.y *= 400;

                this.snowballs[i].addAI(SnowballBehavior);
                (this.snowballs[i]._ai as SnowballBehavior).velocity = dir;

                // Set the starting position of the fireball
                this.snowballs[i].position.copy(location);

                // Give physics to this fireball
                let snowballHitbox = new Circle(location, 50)
                this.snowballs[i].addPhysics(snowballHitbox);
                this.snowballs[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);

                break;
            }
        }
    }

    protected despawnSnowball(id: number, hitEntity: String) {
        for (let i = 0; i < this.snowballs.length; i++) {
            if (this.snowballs[i].id === id) {
                if (hitEntity === HitEntity.PLAYER) {
                    this.emitter.fireEvent(COFEvents.ENEMY_SPELL_HIT_PLAYER, {effect: SpellEffects.SLOW})
                }
                (this.snowballs[i]._ai as SnowballBehavior).changeState(SnowballStates.DESPAWN);
                break;
            }
        }
    }

    protected spawnDemonCircle(location: Vec2) {
        for (let i = 0; i < this.demonSummoningCircles.length; i++) {
            if (!this.demonSummoningCircles[i].visible) {
                this.demonSummoningCircles[i].visible = true;

                this.demonSummoningCircles[i].position.copy(location);
                this.demonSummoningCircles[i].addAI(DemonSummoningCircleBehavior);

                (this.demonSummoningCircles[i]._ai as DemonSummoningCircleBehavior).location = location;
                break;
            }
        }
    }

    protected despawnDemonCircle(id: number) {
        for (let i = 0; i < this.demonSummoningCircles.length; i++) {
            if (this.demonSummoningCircles[i].id === id) {
                this.demonSummoningCircles[i].position.copy(Vec2.ZERO);
                this.demonSummoningCircles[i].visible = false;
                break;
            }
        }
    }

    protected spawnShadowDemon(location: Vec2): void {
        for (let i = 0; i < this.shadowDemons.length; i++) {
            if(!this.shadowDemons[i].visible) {

                this.shadowDemons[i].position.copy(location);
                // Bring this shadow demon to life
                this.shadowDemons[i].visible = true;

                this.shadowDemons[i].addAI(ShadowDemonController, {player: this.player});

                let enemyHitbox = this.shadowDemons[i].boundary.getHalfSize().clone();
                enemyHitbox.x = enemyHitbox.x - 6;

                // Give physics to this demon
                let shadowDemonHitbox = new AABB(this.shadowDemons[i].position.clone(), new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x-15, this.enemyBoss.boundary.getHalfSize().clone().y-15));
                this.shadowDemons[i].addPhysics(shadowDemonHitbox);
                this.shadowDemons[i].setGroup(COFPhysicsGroups.ENEMY);
                this.shadowDemons[i].setTrigger(COFPhysicsGroups.FIREBALL, ShadowDemonEvents.FIREBALL_HIT_SHADOW_DEMON, "");

                break;
            }
        }
    }

    protected despawnShadowDemon(id: number): void {
        for (let i = 0; i < this.shadowDemons.length; i++) {
            if (this.shadowDemons[i].id === id) {
                this.shadowDemons[i].position.copy(Vec2.ZERO);
                this.shadowDemons[i].visible = false;
                break;
            }
        }
    }

    /**
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the fireball should go
    */
    protected spawnShadowDemonFireball(faceDir: Vec2, id: number) {
        for(let i = 0; i < this.shadowDemons.length; i++) {
            if (this.shadowDemons[i].id !== id)
                continue;

            for (let j = 0; j < this.shadowDemonFireballs[i].length; j++) {
                if (!this.shadowDemonFireballs[i][j].visible) {
                    // Bring this fireball to life
                    this.shadowDemonFireballs[i][j].visible = true;

                    // Set the velocity
                    faceDir.x *= 400;
                    faceDir.y *= 400;

                    (this.shadowDemonFireballs[i][j]._ai as FireballBehavior).velocity = faceDir

                    // Set the starting position of the fireball
                    this.shadowDemonFireballs[i][j].position.copy(this.shadowDemons[i].position);

                    // Give physics to this fireball
                    let fireballHitbox = new AABB(this.shadowDemons[i].position.clone(), this.shadowDemonFireballs[i][j].boundary.getHalfSize().clone());
                    this.shadowDemonFireballs[i][j].addPhysics(fireballHitbox);
                    this.shadowDemonFireballs[i][j].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
                    
                    break;
                }
            }
        }
    }
    

    protected despawnShadowDemonFireball(id: number): void {
        for (let i = 0; i < this.shadowDemons.length; i++) {
            for (let j = 0; j < this.shadowDemonFireballs[i].length; j++) {
                if (this.shadowDemonFireballs[i][j].id === id) {
                    this.shadowDemonFireballs[i][j].position.copy(Vec2.ZERO);
                    this.shadowDemonFireballs[i][j].visible = false;
                    break;
                }
            }
        }
    }

    protected handleFireballHitShadowDemon(id: number, entity: string) {
        this.emitter.fireEvent(COFEvents.FIREBALL_HIT_ENEMY, {other: id, entity: entity});
    }

    protected handlePlayerSwing(faceDir: number): void {
        super.handlePlayerSwing(faceDir);

        let playerSwingHitbox = this.player.boundary.getHalfSize().clone();
        playerSwingHitbox.x = playerSwingHitbox.x-16;

        let swingPosition = this.player.position.clone();
        swingPosition.x += faceDir*14;

        for (let i = 0; i < this.shadowDemons.length; i++) {
            if (!this.shadowDemons[i].visible) {
                continue;
            }
            else if (this.shadowDemons[i].collisionShape.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
                this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.shadowDemons[i].id, entity: COFEntities.MINION});
            }
        }
    }

    protected handleShadowDemonSwipe(id: number, direction: number) {
        for (let i = 0; i < this.shadowDemons.length; i++) {
            if (this.shadowDemons[i].id != id)
                continue;

            let shadowDemonSwipeHitbox = this.shadowDemons[i].boundary.getHalfSize().clone();
            shadowDemonSwipeHitbox.x = shadowDemonSwipeHitbox.x-16;

            let swingPosition = this.shadowDemons[i].position.clone();
            swingPosition.x += direction*14;

            if (this.player.collisionShape.overlaps(new AABB(swingPosition,shadowDemonSwipeHitbox))) {
                this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
            }

            break;
        }
    }

    protected handleMinionDead(id: number): void {
        this.despawnShadowDemon(id);
    }

    protected handleBossTeleportation(location: Vec2): void { 
        this.enemyBoss.position.copy(location);
    }
}