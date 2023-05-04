import COFLevel from "./COFLevel";
import { COFLayers } from "./COFLevel";
import COFLevel5 from "./COFLevel5"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import DarkStalkerController from "../Enemy/DarkStalker copy/DarkStalkerController";
import COFLevel3 from "./COFLevel3";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { DarkStalkerEvents } from "../Enemy/DarkStalker copy/DarkStalkerEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import FireballBehavior from "../Fireball/FireballBehavior";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import MissleBehavior from "../Enemy/DarkStalker copy/AttackBehaviors/MissleBehavior";
import { COFEvents } from "../COFEvents";

export default class COFLevel2 extends COFLevel {

    /** Objects pools for various attacks */
    private mineBalls: Array<AnimatedSprite>;
    private missles: Array<AnimatedSprite>;
    private eyeBalls: Array<AnimatedSprite>;


    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("darkstalker", "cof_assets/spritesheets/Enemies/dark_stalker.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("darkstalker");
        this.initializeEnemyBoss("darkstalker", DarkStalkerController, 1, [700, 700], -15, -15);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch(event.type) {
            case DarkStalkerEvents.FIRE_MISSLE: {
                this.shootMissle();
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_WALL: {
                this.despawnProjectile(event.data.get("node"));
            }
        }
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel3)
    }

    protected initObjectPools(): void {
        super.initObjectPools();

        this.mineBalls = new Array(12);
        this.missles = new Array(4);
        this.eyeBalls = new Array(4);

        /** mineBalls initialization */
        for (let i = 0; i < 12; i++) {
            // TODO make a sprite for this!!!
            this.mineBalls[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            this.mineBalls[i].visible = false; // Turns them off.

            // this.mineBalls[i].addAI(); // Adds an AI to them..

            // This will have no group.
            // When the mine activates, it will have the contact damage group!
        }

        /** Missles and eyeBall initialization */
        for (let i = 0; i < 4; i++) {
            // TODO make a sprite for them!!

            this.missles[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);
            this.eyeBalls[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            this.missles[i].visible = false;
            this.eyeBalls[i].visible = false;

            // TODO add AI for both of them.
            this.missles[i].addAI(MissleBehavior, {player: this.player});
        }
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();

        this.receiver.subscribe(DarkStalkerEvents.FIRE_MISSLE);
    }

    protected shootMissle(): void {
        for (let i = 0; i < 4; i++) {
            if (!this.missles[i].visible) {
                // Move object to enemy boss position.
                // TODO: Adjust when animation is added.
                this.missles[i].position.copy(this.enemyBoss.position);
                this.missles[i].position.y -= 100;

                // Add physics
                let hitbox = new AABB(
                    this.missles[i].position.clone(),
                    this.missles[i].boundary.getHalfSize().clone()
                );
                this.missles[i].addPhysics(hitbox);
                this.missles[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);

                (this.missles[i]._ai as MissleBehavior).velocity = (new Vec2(200,200)).clone();

                (this.missles[i]._ai as MissleBehavior).reset();
                this.missles[i].visible = true;

                return;
            }
        }
    }

    private despawnProjectile(node: number): void {
        for (let i = 0; i < 4; i++) {
            if (this.missles[i].id == node) {
                this.missles[i].visible = false;
                this.missles[i].position.copy(Vec2.ZERO);
            }
        }
    }
}