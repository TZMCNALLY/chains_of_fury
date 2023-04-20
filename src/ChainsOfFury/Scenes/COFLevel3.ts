import COFLevel from "./COFLevel";
import COFLevel4 from "./COFLevel4"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import MindFlayerController from "../Enemy/MindFlayer/MindFlayerController";

export default class COFLevel3 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("mind_flayer", "cof_assets/spritesheets/mind_flayer.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Mind Flayer");
        this.initializeEnemyBoss("mind_flayer", MindFlayerController);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel4)
    }
}