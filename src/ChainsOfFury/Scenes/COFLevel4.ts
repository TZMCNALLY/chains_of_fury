import COFLevel from "./COFLevel";
import COFLevel5 from "./COFLevel5";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import ReaperController from "../Enemy/Reaper/ReaperController";
import { ReaperEvents } from "../Enemy/Reaper/ReaperEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { COFLayers } from "./COFLevel";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import DeathCircleBehavior from "../Spells/DeathCircle/DeathCircleBehavior";
import { DeathCircleEvents } from "../Spells/DeathCircle/DeathCircleEvents";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import { COFEvents } from "../COFEvents";
import { SpellEffects } from "../Spells/SpellEffects";
import SlashBehavior from "../Spells/Slash/SlashBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { SlashEvents } from "../Spells/Slash/SlashEvents";

export default class COFLevel4 extends COFLevel {

    /** Object pool for death circles */
    private deathCircles: Array<AnimatedSprite> = new Array(5);

    /** Object pool for slashes */
    private slashes: Array<AnimatedSprite> = new Array(5);

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        super.loadScene();
        this.load.spritesheet("reaper", "cof_assets/spritesheets/Enemies/reaper.json");
        this.load.spritesheet("death_circle", "cof_assets/spritesheets/Spells/death_circle.json")
        this.load.spritesheet("slash", "cof_assets/spritesheets/Spells/slash.json")
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Reaper");
        this.initializeEnemyBoss("reaper", ReaperController, 1, [700, 700], -25, -15);
    }

    protected initObjectPools(): void {
		super.initObjectPools();

        // initialize all death circle objects
		for (let i = 0; i < this.deathCircles.length; i++) {
			this.deathCircles[i] = this.add.animatedSprite("death_circle", COFLayers.PRIMARY);
			this.deathCircles[i].visible = false;
			this.deathCircles[i].scale.set(6, 6);
	    }

        // initialize all slash objects
        for (let i = 0; i < this.slashes.length; i++) {
			this.slashes[i] = this.add.animatedSprite("slash", COFLayers.PRIMARY);
            this.slashes[i].visible = false;
            this.slashes[i].addAI(SlashBehavior);
			this.slashes[i].scale.set(1.5, 1.5);
	    }
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel5)
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(ReaperEvents.SPAWN_DEATH_CIRCLE);
        this.receiver.subscribe(DeathCircleEvents.CIRCLE_ACTIVE);
        this.receiver.subscribe(DeathCircleEvents.DESPAWN_CIRCLE);
        this.receiver.subscribe(ReaperEvents.THROW_SLASH);
        this.receiver.subscribe(SlashEvents.DESPAWN_SLASH);
    }

     /**
     * Handle game events. 
     * @param event the game event
     */
     protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case ReaperEvents.SPAWN_DEATH_CIRCLE: {
                this.handleSpawnDeathCircle(event.data.get("location"));
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
            case ReaperEvents.THROW_SLASH: {
                this.handleThrowSlash(event.data.get("spawn"), event.data.get("direction"), event.data.get("speed"));
                break;
            }
            case SlashEvents.DESPAWN_SLASH: {
                this.handleDespawnSlash(event.data.get("id"));
                break;
            }
        }
    }

    public handleSpawnDeathCircle(location: Vec2) {
        for (let i = 0; i < this.deathCircles.length; i++) {
            if (!this.deathCircles[i].visible) {
                this.deathCircles[i].visible = true;

                this.deathCircles[i].position.copy(location);
                this.deathCircles[i].addAI(DeathCircleBehavior);

                let deathCircleHitbox = new Circle(location, 155)
                this.deathCircles[i].addPhysics(deathCircleHitbox, Vec2.ZERO, false, true);
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

    public handleThrowSlash(spawn: Vec2, direction: number, speed: number) {
        for (let i = 0; i < this.slashes.length; i++) {
            if (!this.slashes[i].visible) {
                this.slashes[i].visible = true;

                (this.slashes[i]._ai as SlashBehavior).velocity = new Vec2(direction * speed, 0);
                (this.slashes[i]._ai as SlashBehavior).player = this.player;
                this.slashes[i].position.copy(spawn);

                let slashHitBox = new AABB(spawn, this.slashes[i].boundary.getHalfSize().clone());
                this.slashes[i].addPhysics(slashHitBox, null, false, false);

                if (direction > 0) {
                    this.slashes[i].invertX = true;
                }
                else {
                    this.slashes[i].invertX = false;
                }
                break;
            }
        }
    }

    public handleDespawnSlash(id: number) {
        for (let i = 0; i < this.slashes.length; i++) {
            if (this.slashes[i].id === id) {
                this.slashes[i].position.copy(Vec2.ZERO);
                this.slashes[i].visible = false;
                break;
            }
        }
    }
}