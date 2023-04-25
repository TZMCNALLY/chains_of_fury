import COFLevel from "./COFLevel";
import COFLevel5 from "./COFLevel5";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import ReaperController from "../Enemy/Reaper/ReaperController";

export default class COFLevel4 extends COFLevel {

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("reaper", "cof_assets/spritesheets/reaper.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Reaper");
        this.initializeEnemyBoss("reaper", ReaperController, 1, [700, 700], -15, -15);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel5)
    }
}