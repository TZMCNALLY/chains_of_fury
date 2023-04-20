import COFLevel from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import MainMenu from "./MainMenu";

export default class COFLevel6 extends COFLevel {

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
        this.initializeEnemyBoss("moondog", MoonDogController);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(MainMenu)
    }
}