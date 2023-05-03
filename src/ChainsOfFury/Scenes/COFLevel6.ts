import COFLevel from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import DemonKingController from "../Enemy/DemonKing/DemonKingController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import MainMenu from "./MainMenu";
import GameEvent from '../../Wolfie2D/Events/GameEvent';
import { COFEvents } from '../COFEvents';
import { DemonKingEvents } from "../Enemy/DemonKing/DemonKingStates/DemonKingEvents";

export default class COFLevel6 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Demon King");
        this.initializeEnemyBoss("wraith", DemonKingController, 1, [700, 700], -15, -15);
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case DemonKingEvents.STRUCK_LIGHTNING: {
                this.handleLightningStrike();
            }
            case COFEvents.BOSS_DEFEATED: {
                this.handleLevelEnd();
                break;
            }
        }
    }

    protected handleLightningStrike(): void {

        
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
        this.receiver.subscribe(DemonKingEvents.STRUCK_LIGHTNING);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(MainMenu)
    }
}