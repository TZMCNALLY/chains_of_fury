import COFLevel from "./COFLevel";
import { COFLayers } from "./COFLevel";
import COFLevel5 from "./COFLevel5"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import DarkStalkerController from "../Enemy/DarkStalker copy/DealthStalkerStates/DarkStalkerController";
import COFLevel3 from "./COFLevel3";
import { COFPhysicsGroups } from "../COFPhysicsGroups";

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

            // TODO add AI for both of them.

            // Only missles will have ENEMY_PROJECTILE group.
            this.missles[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
        }
    }
}