import COFLevel from "./COFLevel";
import COFLevel5 from "./COFLevel5"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import DarkStalkerController from "../Enemy/DarkStalker copy/DealthStalkerStates/DarkStalkerController";
import COFLevel3 from "./COFLevel3";

export default class COFLevel2 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("darkstalker", "cof_assets/spritesheets/dark_stalker.json");
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
}