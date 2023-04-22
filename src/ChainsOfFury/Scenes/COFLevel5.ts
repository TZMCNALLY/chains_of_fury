import COFLevel from "./COFLevel";
import COFLevel6 from "./COFLevel6";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import SwordController from "../Enemy/Sword/SwordController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import { SwordTweens } from "../Enemy/Sword/SwordController";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { AzazelTweens } from "../Player/AzazelController";
import AABB from '../../Wolfie2D/DataTypes/Shapes/AABB';
import { SwordEvents } from "../Enemy/Sword/SwordEvents";
import { COFEvents } from "../COFEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';

export default class COFLevel5 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("flying_sword", "cof_assets/spritesheets/flying_sword.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Satan's Blade");
        this.initializeEnemyBoss("flying_sword", SwordController, 1);
        this.enemyBoss.tweens.add(SwordTweens.SPIN, {
            startDelay: 0,
            duration: 100,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI * 2,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case SwordEvents.BASIC_ATTACK: {
                this.handleBasicAttack(event.data.get("lastFace"));
                break;
            }
            case SwordEvents.SPIN_ATTACK: {
                this.handleSpinAttack()
            }
        }
    }

    protected handleBasicAttack(lastFace: number) {

        let basicAttackHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        if(lastFace == -1)
            basicAttackHitbox.x = basicAttackHitbox.x - 8;
        else
            basicAttackHitbox.x = basicAttackHitbox.x + 8;

        let basicAttackPosition = this.enemyBoss.position.clone();

        if (this.player.collisionShape.overlaps(new AABB(basicAttackPosition, basicAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PLAYER_HIT);
        }
    }

    protected handleSpinAttack() {
        let basicAttackHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        let basicAttackPosition = this.enemyBoss.position.clone();

        if (this.player.collisionShape.overlaps(new AABB(basicAttackPosition, basicAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PLAYER_HIT);
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(SwordEvents.BASIC_ATTACK);
        this.receiver.subscribe(SwordEvents.SPIN_ATTACK)
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel6)
    }
}