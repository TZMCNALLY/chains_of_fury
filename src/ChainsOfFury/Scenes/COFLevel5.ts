import COFLevel, { COFLayers } from "./COFLevel";
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
import { COFPhysicsGroups } from '../COFPhysicsGroups';
import FireballBehavior from '../Fireball/FireballBehavior';
import Viewport from '../../Wolfie2D/SceneGraph/Viewport';
import SceneManager from '../../Wolfie2D/Scene/SceneManager';
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Game from "../../Wolfie2D/Loop/Game";
import { GameEventType } from '../../Wolfie2D/Events/GameEventType';

export default class COFLevel5 extends COFLevel {

    protected swordMinion: AnimatedSprite
    protected swordProjectiles: Array<AnimatedSprite>
    public static readonly BASIC_ATTACK_AUDIO_PATH = "cof_assets/sounds/sword_basic_audio.wav";
    public static readonly SPIN_ATTACK_AUDIO_PATH = "cof_assets/sounds/sword_spin_audio.wav";
    protected basicAttackAudioKey = "BASIC_ATTACK_AUDIO_KEY";
    protected spinAttackAudioKey = "SPIN_ATTACK_AUDIO_KEY"

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {

        super(viewport, sceneManager, renderingManager, options);

        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.audio(this.basicAttackAudioKey, COFLevel5.BASIC_ATTACK_AUDIO_PATH);
        this.load.audio(this.spinAttackAudioKey, COFLevel5.SPIN_ATTACK_AUDIO_PATH);
        this.load.spritesheet("flying_sword", "cof_assets/spritesheets/flying_sword.json");
        this.load.spritesheet("flying_sword_minion", "cof_assets/spritesheets/flying_sword_minion.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Satan's Blade");
        this.initializeEnemyBoss("flying_sword", SwordController, 1, [400, 400], -32, -16);
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
        //A slower version of spin, except for spin it's an attack while twirl is for visual effect
        this.enemyBoss.tweens.add(SwordTweens.TWIRL, {
            startDelay: 0,
            duration: 300,
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
            case SwordEvents.MINION_SUMMONED: {
                this.initializeMinion("flying_sword_minion", SwordController, 1, [600, 700], -32, -16)
            }
            case SwordEvents.SPIN_ATTACK: {
                this.handleSpinAttack();
                break;
            }
            case COFEvents.BOSS_DEFEATED: {
                this.handleLevelEnd();
                break;
            }
        }
    }

    protected initObjectPools(): void {
        super.initObjectPools();

        this.swordProjectiles = new Array(20)
        for (let i = 0; i < this.swordProjectiles.length; i++) {
			this.swordProjectiles[i] = this.add.animatedSprite("flying_sword", COFLayers.PRIMARY);

            // Make our fireballs inactive by default
			this.swordProjectiles[i].visible = false;

			// Assign them fireball ai
			this.swordProjectiles[i].addAI(FireballBehavior);

            this.swordProjectiles[i].setGroup(COFPhysicsGroups.FIREBALL);
			this.swordProjectiles[i].scale.set(1.5, 1.5);
	    }
    }

    protected initializeMinion(key: string, controller: new (...a: any[]) => EnemyController,
     scaleSize: number, enemySpawn: number[], hitBoxModifierX: number, hitBoxModifierY: number): void {
        this.swordMinion = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.swordMinion.scale.set(scaleSize, scaleSize);
        this.swordMinion.position.copy(new Vec2(enemySpawn[0], enemySpawn[1]));

        // Give enemy boss its AI
        this.swordMinion.addAI(controller, {player: this.player});

        let enemyHitbox = this.swordMinion.boundary.getHalfSize().clone();
        enemyHitbox.x = enemyHitbox.x - 6;

        this.swordMinion.addPhysics(new AABB(this.swordMinion.position.clone(), 
        new Vec2(this.swordMinion.boundary.getHalfSize().clone().x+hitBoxModifierX, this.swordMinion.boundary.getHalfSize().clone().y+hitBoxModifierY)));
        this.swordMinion.setGroup(COFPhysicsGroups.ENEMY);
        this.swordMinion.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, null);
    }

    protected spawnSwordProjectiles(faceDir: Vec2) {
        for(let i = 0; i < this.swordProjectiles.length; i++) {

            if(!this.swordProjectiles[i].visible) {

                // Bring this fireball to life
                this.swordProjectiles[i].visible = true;

                let dirToPlayer = this.swordMinion.position.dirTo(this.player.position)

                // Set the velocity to be in the direction of the mouse
                dirToPlayer.x *= 400;
                dirToPlayer.y *= 400;

                (this.swordProjectiles[i]._ai as FireballBehavior).velocity = dirToPlayer

                // Give physics to this fireball
                let fireballHitbox = new AABB(this.swordMinion.position.clone(), this.swordProjectiles[i].boundary.getHalfSize().clone());
                this.swordProjectiles[i].addPhysics(fireballHitbox);
                this.swordProjectiles[i].setGroup(COFPhysicsGroups.FIREBALL);
                
                break;
            }
        }
    }

    protected despawnSwordProjectiles(node: number) : void {
        for(let i = 0; i < this.swordProjectiles.length; i++) {

            if(this.swordProjectiles[i].id == node) {

                this.swordProjectiles[i].position.copy(Vec2.ZERO);
                this.swordProjectiles[i].visible = false;
                break;
            }
        }
    }

    protected handleBasicAttack(lastFace: number) {

        let basicAttackHitbox = new Vec2(16, 40)
        let basicAttackPosition = this.enemyBoss.position.clone();

        if(lastFace == -1)
            basicAttackPosition.x -= 32;
        else
            basicAttackPosition.x += 32;

        if (this.player.collisionShape.overlaps(new AABB(basicAttackPosition, basicAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
        }
    }

    protected handleSpinAttack() {
        let basicAttackHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        let basicAttackPosition = this.enemyBoss.position.clone();

        //dmg number
        if (this.player.collisionShape.overlaps(new AABB(basicAttackPosition, basicAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(SwordEvents.BASIC_ATTACK);
        this.receiver.subscribe(SwordEvents.SPIN_ATTACK);
        this.receiver.subscribe(SwordEvents.MINION_SUMMONED)
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel6)
    }

    public getSpinAudio(): string {
        return this.spinAttackAudioKey;
    }

    public getBasicAttackAudio(): string {
        return this.basicAttackAudioKey;
    }
}