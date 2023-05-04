import COFLevel, { COFLayers } from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import DemonKingController from "../Enemy/DemonKing/DemonKingController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import MainMenu from "./MainMenu";
import GameEvent from '../../Wolfie2D/Events/GameEvent';
import { COFEvents } from '../COFEvents';
import { DemonKingEvents } from "../Enemy/DemonKing/DemonKingStates/DemonKingEvents";
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";

export default class COFLevel6 extends COFLevel {

    protected lightningStrike: AnimatedSprite;

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");
        this.load.spritesheet("lightning_strike", "cof_assets/spritesheets/Spells/lightning_strike.json")
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Demon King");
        this.initializeEnemyBoss("wraith", DemonKingController, 1, [400, 400], -15, -15);
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
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
        this.receiver.subscribe(DemonKingEvents.STRUCK_LIGHTNING);
        this.receiver.subscribe(DemonKingEvents.LIGHTNING_STRIKE_ENDED);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(MainMenu)
    }
}