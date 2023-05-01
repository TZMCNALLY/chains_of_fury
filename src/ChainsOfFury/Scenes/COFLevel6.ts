import COFLevel from "./COFLevel";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import DemonKingController from "../Enemy/DemonKing/DemonKingController";
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
        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Demon King");
        this.initializeEnemyBoss("wraith", DemonKingController, 1, [700, 700], -15, -15);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(MainMenu)
    }
}