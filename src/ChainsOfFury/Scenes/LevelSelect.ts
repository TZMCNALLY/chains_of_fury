import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import { MenuLayers } from "./MainMenu";

import COFLevel1 from "./COFLevel1";
import COFLevel2 from "./COFLevel2";
import COFLevel3 from "./COFLevel3";
import COFLevel4 from "./COFLevel4";
import COFLevel5 from "./COFLevel5";
import COFLevel6 from "./COFLevel6";
import { COFCheats } from "../COFCheats";
import Input from "../../Wolfie2D/Input/Input";

export default class LevelSelect extends Scene {
    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        this.load.spritesheet("moondog", "cof_assets/spritesheets/Enemies/moondog.json");  
        this.load.spritesheet("darkstalker", "cof_assets/spritesheets/Enemies/dark_stalker.json");
        this.load.spritesheet("mind_flayer", "cof_assets/spritesheets/Enemies/mind_flayer.json");
        this.load.spritesheet("reaper", "cof_assets/spritesheets/Enemies/reaper.json");
        this.load.spritesheet("flying_sword", "cof_assets/spritesheets/Enemies/flying_sword.json");
        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");

        this.load.spritesheet("moondog_silhouette", "cof_assets/spritesheets/Silhouettes/moondog_silhouette.json");
        this.load.spritesheet("darkstalker_silhouette", "cof_assets/spritesheets/Silhouettes/dark_stalker_silhouette.json");
        this.load.spritesheet("mind_flayer_silhouette", "cof_assets/spritesheets/Silhouettes/mind_flayer_silhouette.json");
        this.load.spritesheet("reaper_silhouette", "cof_assets/spritesheets/Silhouettes/reaper_silhouette.json");
        this.load.spritesheet("flying_sword_silhouette", "cof_assets/spritesheets/Silhouettes/flying_sword_silhouette.json");
        this.load.spritesheet("wraith_silhouette", "cof_assets/spritesheets/Silhouettes/wraith_silhouette.json");

        this.load.spritesheet("lock", "cof_assets/images/lock.json")
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);
        this.addUILayer(MenuLayers.SPRITES);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        let title = <Label>this.add.uiElement(
            UIElementType.LABEL,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y-350),
                text: "Levels"
            }
        );
        title.fontSize = 55;
        title.textColor = Color.RED;


        let subTitle = <Label>this.add.uiElement(
            UIElementType.LABEL,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y-250),
                text: "Choose one of the following levels to play."
            }
        );
        subTitle.fontSize = 25;
        subTitle.textColor = Color.RED;


        // Buttons:
        let level1 = this.makeLevelBox(size.x-350, size.y-100, "");
        let level2 = this.makeLevelBox(size.x, size.y-100, "");
        let level3 = this.makeLevelBox(size.x+350, size.y-100, "");
        let level4 = this.makeLevelBox(size.x-350, size.y+200, "");
        let level5 = this.makeLevelBox(size.x, size.y+200, "");
        let level6 = this.makeLevelBox(size.x+350, size.y+200, "");

        // Scene transitions:
        level1.onClick = () => {
            if (MainMenu.boss1Defeated)
                this.sceneManager.changeToScene(COFLevel1);
        };

        level2.onClick = () => {
            if (MainMenu.boss2Defeated)
                this.sceneManager.changeToScene(COFLevel2);
        };

        level3.onClick = () => {
            if (MainMenu.boss3Defeated)
                this.sceneManager.changeToScene(COFLevel3);
        };

        level4.onClick = () => {
            if (MainMenu.boss4Defeated)
                this.sceneManager.changeToScene(COFLevel4);
        };

        level5.onClick = () => {
            if (MainMenu.boss5Defeated)
                this.sceneManager.changeToScene(COFLevel5);
        };
        
        level6.onClick = () => {
            if (MainMenu.boss6Defeated)
                this.sceneManager.changeToScene(COFLevel6);
        };

        // Back button:
        let back = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x-500, size.y+340),
                text: "Back"
            }
        );
        back.backgroundColor = Color.BLACK;
        back.borderColor = Color.BLACK;
        back.borderRadius = 0;
        back.font = "PixelSimple";
        back.fontSize = 30;
        back.textColor = Color.RED;
        back.size.set(100, 60);

        back.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        }

        this.generateLevelImages();
    }

    public unloadScene(): void {
    }

    public update(deltaT: number): void {
        super.update(deltaT);
        if (Input.isJustPressed(COFCheats.UNLOCK_ALL)) {
            MainMenu.boss1Defeated = true;
            MainMenu.boss2Defeated = true;
            MainMenu.boss3Defeated = true;
            MainMenu.boss4Defeated = true;
            MainMenu.boss5Defeated = true;
            MainMenu.boss6Defeated = true;

            // Reloads this scene to refresh everything (inefficient but oh well)
            this.sceneManager.changeToScene(LevelSelect);
        }
    }

    // Creates a level box and appends it onto main layer.
    // x and y are positions of the box
    public makeLevelBox(x: number, y: number, txt: String): Button {
        let levelBox = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(x, y),
                text: txt
            }
        );
        levelBox.backgroundColor = new Color(139, 0, 0);
        levelBox.borderColor = Color.BLACK;
        levelBox.borderWidth = 3;
        levelBox.font = "PixelSimple";
        levelBox.fontSize = 20;
        levelBox.textColor = Color.RED;
        levelBox.size.set(200, 200);

        return levelBox;
    }

    private generateLevelImages() {
        let size = this.viewport.getHalfSize();

        if (!MainMenu.boss1Defeated) {
            this.createSprite(size.x-350, size.y-100, 1.5, 1.5, "moondog_silhouette", "IDLE");
            this.createLock(size.x-350, size.y-100);
        }
        else {
            this.createSprite(size.x-350, size.y-100, 1.5, 1.5, "moondog", "IDLE");
        }

        if (!MainMenu.boss2Defeated) {
            this.createSprite(size.x, size.y-100, 1.5, 1.5, "darkstalker_silhouette", "IDLE");
            this.createLock(size.x, size.y-100);
        }
        else {
            this.createSprite(size.x, size.y-100, 1.5, 1.5, "darkstalker", "IDLE");
        }

        if (!MainMenu.boss3Defeated) {
            this.createSprite(size.x+350, size.y-100, 0.7, 0.7, "mind_flayer_silhouette", "IDLE");
            this.createLock(size.x+350, size.y-100);
        }
        else {
            this.createSprite(size.x+350, size.y-100, 0.7, 0.7, "mind_flayer", "IDLE");
        }

        if (!MainMenu.boss4Defeated) {
            this.createSprite(size.x-350, size.y+200, 1.5, 1.5, "reaper_silhouette", "IDLE");
            this.createLock(size.x-350, size.y+200);
        }
        else {
            this.createSprite(size.x-350, size.y+200, 1.5, 1.5, "reaper", "IDLE");
        }

        if (!MainMenu.boss5Defeated) {
            this.createSprite(size.x, size.y+200, 1.5, 1.5, "flying_sword_silhouette", "IDLE");
            this.createLock(size.x, size.y+200);
        }
        else {
            this.createSprite(size.x, size.y+200, 1.5, 1.5, "flying_sword", "IDLE");
        }

        if (!MainMenu.boss6Defeated) {
            this.createSprite(size.x+350, size.y+200, 1.5, 1.5, "wraith_silhouette", "IDLE");
            this.createLock(size.x+350, size.y+200);
        }
        else {
            this.createSprite(size.x+350, size.y+200, 1.5, 1.5, "wraith", "IDLE_LEFT");
        }
    }

    protected createLock(posX: number, posY: number) {
        let lock = this.add.sprite("lock", MenuLayers.SPRITES);
        lock.scale.set(4, 4);
        lock.position = new Vec2(posX, posY);
    }

    // Create animated sprite at x,y.
    // s: scale, key: key of sprite.
    protected createSprite(x: number, y: number, sx: number, sy: number, key: string, animation: string) {
        let sprite = this.add.animatedSprite(key, MenuLayers.SPRITES);
        sprite.scale.set(sx, sy);
        sprite.position.set(x, y);
        sprite.animation.play(animation, true);

        return sprite;
    }
}