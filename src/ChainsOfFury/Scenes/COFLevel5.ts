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

export default class COFLevel5 extends COFLevel {

    protected swordProjectiles: Array<AnimatedSprite>

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
        this.initializeEnemyBoss("flying_sword", SwordController, 1, [700, 700]);
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

    protected initObjectPools(): void {
        super.initObjectPools();

        this.swordProjectiles = new Array(20)
        for (let i = 0; i < this.swordProjectiles.length; i++) {
			this.swordProjectiles[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            // Make our fireballs inactive by default
			this.swordProjectiles[i].visible = false;

			// Assign them fireball ai
			this.swordProjectiles[i].addAI(FireballBehavior);

            this.swordProjectiles[i].setGroup(COFPhysicsGroups.FIREBALL);
			this.swordProjectiles[i].scale.set(1.5, 1.5);
	    }
    }

    protected spawnSwordProjectiles(faceDir: Vec2) {
        for(let i = 0; i < this.swordProjectiles.length; i++) {

            if(!this.swordProjectiles[i].visible) {

                // Bring this fireball to life
                this.swordProjectiles[i].visible = true;

                let dirToPlayer = this.enemyBoss.position.dirTo(this.player.position)

                // Set the velocity to be in the direction of the mouse
                dirToPlayer.x *= 400;
                dirToPlayer.y *= 400;

                (this.swordProjectiles[i]._ai as FireballBehavior).velocity = dirToPlayer

                // Give physics to this fireball
                let fireballHitbox = new AABB(this.enemyBoss.position.clone(), this.swordProjectiles[i].boundary.getHalfSize().clone());
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

    protected initializeEnemyBoss(key: string, controller: new (...a: any[]) => EnemyController, scaleSize: number, enemySpawn: number[]): void {
        super.initializeEnemyBoss(key, controller, scaleSize, enemySpawn);
        this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x-32, this.enemyBoss.boundary.getHalfSize().clone().y-16)));
        this.enemyBoss.setGroup(COFPhysicsGroups.ENEMY);
        this.enemyBoss.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, null);
    }

    protected handleBasicAttack(lastFace: number) {

        let basicAttackHitbox = new Vec2(25, 20)
        let basicAttackPosition = this.enemyBoss.position.clone();

        if(lastFace == -1)
            basicAttackPosition.x -= 32;
        else
            basicAttackPosition.x += 32;

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