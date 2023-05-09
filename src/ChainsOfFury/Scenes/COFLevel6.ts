import COFLevel, { COFLayers } from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import DemonKingController from "../Enemy/DemonKing/DemonKingController";
import MainMenu from "./MainMenu";
import GameEvent from '../../Wolfie2D/Events/GameEvent';
import { COFEvents } from '../COFEvents';
import { DemonKingEvents } from "../Enemy/DemonKing/DemonKingEvents";
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import DeathCircleBehavior from "../Spells/DeathCircle/DeathCircleBehavior";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import { SpellEffects } from "../Spells/SpellEffects";
import { DeathCircleEvents } from "../Spells/DeathCircle/DeathCircleEvents";
import SkullBehavior from "../Enemy/DemonKing/SkullBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import Viewport from '../../Wolfie2D/SceneGraph/Viewport';
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";

export default class COFLevel6 extends COFLevel {

    protected lightningStrike: AnimatedSprite;
    /** Object pool for death circles*/
    private deathCircles: Array<AnimatedSprite>;
    private skulls: Array<AnimatedSprite>;

    public static readonly LIGHTNING_STRIKE_AUDIO_KEY = "LIGHTNING_STRIKE_AUDIO_KEY";
    public static readonly LIGHTNING_STRIKE_AUDIO_PATH = "cof_assets/sounds/Enemies/DemonKing/lightning_strike.mp3";
    public static readonly THUNDER_AUDIO_KEY = "THUNDER_AUDIO_KEY";
    public static readonly THUNDER_AUDIO_PATH = "cof_assets/sounds/Enemies/DemonKing/thunder.mp3";

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();

        this.load.audio(COFLevel6.LIGHTNING_STRIKE_AUDIO_KEY, COFLevel6.LIGHTNING_STRIKE_AUDIO_PATH);
        this.load.audio(COFLevel6.THUNDER_AUDIO_KEY, COFLevel6.THUNDER_AUDIO_PATH);

        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");
        this.load.spritesheet("lightning_strike", "cof_assets/spritesheets/Spells/lightning_strike.json")
        this.load.spritesheet("death_circle", "cof_assets/spritesheets/Spells/death_circle.json")
        this.load.spritesheet("flameskull", "cof_assets/spritesheets/Projectiles/flameskull.json")
    }

    public startScene(): void {
        super.startScene();
        this.enemyBossName = "Demon King"
        this.initializeEnemyBoss("wraith", DemonKingController, 1, [750, 480], -15, -15);
    }

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
            [1,1,1,0,0,1,1],
            [0,1,1,0,0,0,0],
            [1,1,1,1,0,0,1],
            [1,0,0,1,0,1,0]
        ];


        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames, collisions
        }});
        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case DemonKingEvents.STRUCK_LIGHTNING: {
                this.spawnLightningStrike(event.data.get("location"));
                this.handleLightningStrike(event.data.get("location"));
                break;
            }
            case COFEvents.BOSS_DEFEATED: {
                this.handleLevelEnd();
                break;
            }
            case DemonKingEvents.LIGHTNING_STRIKE_ENDED: {
                this.despawnLightningStrike();
                break;
            }
            case DeathCircleEvents.CIRCLE_ACTIVE: {
                this.checkIfPlayerCircleOverlap(event.data.get("shape"));
                break;
            }
            case DeathCircleEvents.DESPAWN_CIRCLE: {
                this.handleDespawnDeathCircle(event.data.get("id"));
                break;
            }
            case DemonKingEvents.SPAWN_DEATH_CIRCLE: {
                this.handleSpawnDeathCircle(event.data.get("location"))
                break;
            }
            case DemonKingEvents.SKULLS_SPAWN: {
                this.spawnSkulls(event.data.get("location"))
                break;
            }
            case COFEvents.FIREBALL_HIT_ENEMY_PROJECTILE: {
                this.despawnSkulls(event.data.get("other"))
                this.despawnFireballs(event.data.get("node"))
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_PLAYER: {
                this.despawnSkulls(event.data.get("other"))
                break;
            }
            case DemonKingEvents.SWIPED: {
                this.handleSwipe(event.data.get("lastFace"))
                break;
            }
        }
    }

    protected spawnLightningStrike(location: Vec2): void {
        this.lightningStrike.position.copy(location)
        this.lightningStrike.visible = true;
        this.lightningStrike.animation.play("STRIKE", false, DemonKingEvents.LIGHTNING_STRIKE_ENDED)
    }

    protected despawnLightningStrike(): void { this.lightningStrike.visible = false; }

    protected handleLightningStrike(location: Vec2): void {
        let strikeHitbox = new Vec2(5, 5)
        if (this.player.collisionShape.overlaps(new AABB(location, strikeHitbox))) {
            this.emitter.fireEvent(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        }
    }

    protected initObjectPools(): void {
        super.initObjectPools();

        this.lightningStrike = this.add.animatedSprite("lightning_strike", COFLayers.PRIMARY);
        this.lightningStrike.scale.set(1,9)
        this.lightningStrike.visible = false;

        this.deathCircles = new Array(5);
        this.skulls = new Array(100);

        for (let i = 0; i < this.deathCircles.length; i++) {
			this.deathCircles[i] = this.add.animatedSprite("death_circle", COFLayers.PRIMARY);

			this.deathCircles[i].visible = false;

            //this.deathCircles[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
			this.deathCircles[i].scale.set(6, 6);
	    }

        for (let i = 0; i < this.skulls.length; i++) {
			this.skulls[i] = this.add.animatedSprite("flameskull", COFLayers.PRIMARY);

			this.skulls[i].visible = false;

            this.skulls[i].scale.set(.5, .5)
	    }
    }



    public handleSpawnDeathCircle(location: Vec2) {
        for (let i = 0; i < this.deathCircles.length; i++) {

            if(!this.deathCircles[i].visible) {

                this.deathCircles[i].visible = true;

                this.deathCircles[i].position.copy(location);
                this.deathCircles[i].addAI(DeathCircleBehavior);

                let deathCircleHitbox = new Circle(location, 155)
                this.deathCircles[i].addPhysics(deathCircleHitbox, Vec2.ZERO, false, true);

                break;
            }
        }
    }

    public spawnSkulls(location: Vec2) {

        let theta = 0;
        let numSkullsSpawned = 0
        let currSkullInd = 0
        let playerPosition = this.player.position

        while(numSkullsSpawned != 6) {

            if(!this.skulls[currSkullInd].visible) {

                this.skulls[currSkullInd].visible = true;
                
                // Assign them fireball ai
			    this.skulls[currSkullInd].addAI(SkullBehavior, {location: location, theta: theta, playerPosition: playerPosition});
                theta += 120;

                this.skulls[currSkullInd].position.copy(location);

                this.skulls[currSkullInd].addPhysics(this.skulls[currSkullInd].boundary);
                this.skulls[currSkullInd].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
                this.skulls[currSkullInd].setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY_PROJECTILE, null)
                this.skulls[currSkullInd].setTrigger(COFPhysicsGroups.PLAYER, COFEvents.ENEMY_PROJECTILE_HIT_PLAYER, null)

                numSkullsSpawned++;
            }

            else
                currSkullInd++;
        }
    }

    public despawnSkulls(node: number) {

        for(let i = 0; i < this.skulls.length; i++) {

            if(this.skulls[i].id == node) {

                this.skulls[i].position.copy(Vec2.ZERO);
                this.skulls[i].visible = false;
                break;
            }
        }
    }

    public checkIfPlayerCircleOverlap(collisionShape: Shape) {
        if (this.checkAABBtoCircleCollision(this.player.collisionShape as AABB, collisionShape as Circle)) {
            this.emitter.fireEvent(COFEvents.ENEMY_SPELL_HIT_PLAYER, {effect: SpellEffects.INSTADEATH});
        }
    }

    public handleDespawnDeathCircle(id: number) {
        for (let i = 0; i < this.deathCircles.length; i++) {
            if (this.deathCircles[i].id === id) {
                this.deathCircles[i].position.copy(Vec2.ZERO);
                this.deathCircles[i].visible = false;
                break;
            }
        }
    }

    public handleSwipe(lastFace: number) {

        let swipeAttackHitbox = this.enemyBoss.collisionShape.halfSize;
        let swipeAttackPosition = new Vec2();
        swipeAttackPosition.copy(this.enemyBoss.position)

        if(lastFace == -1)
            swipeAttackPosition.x -= 16;

        else
            swipeAttackPosition.y -= 16;

        if (this.player.collisionShape.overlaps(new AABB(swipeAttackPosition, swipeAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER) //for damage calculation, animation
            this.emitter.fireEvent(DemonKingEvents.SWIPE_HIT_PLAYER); // for slowing effect
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
        this.receiver.subscribe(DemonKingEvents.STRUCK_LIGHTNING);
        this.receiver.subscribe(DemonKingEvents.LIGHTNING_STRIKE_ENDED);
        this.receiver.subscribe(DemonKingEvents.SPAWN_DEATH_CIRCLE);
        this.receiver.subscribe(DeathCircleEvents.CIRCLE_ACTIVE);
        this.receiver.subscribe(DeathCircleEvents.DESPAWN_CIRCLE);
        this.receiver.subscribe(DemonKingEvents.SKULLS_SPAWN);
        this.receiver.subscribe(COFEvents.FIREBALL_HIT_ENEMY_PROJECTILE);
        this.receiver.subscribe(DemonKingEvents.SWIPED);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        MainMenu.boss6Defeated = true;
        this.sceneManager.changeToScene(MainMenu)
    }
}