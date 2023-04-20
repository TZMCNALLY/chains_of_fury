import COFLevel from "./COFLevel";
import COFLevel2 from "./COFLevel2"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";

export default class COFLevel1 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("moondog", "cof_assets/spritesheets/moondog.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Moon Dog");
        this.initializeEnemyBoss("moondog", MoonDogController, 1);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel2)
    }
}