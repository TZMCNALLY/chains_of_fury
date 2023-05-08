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

    // TODO:
    // - Music (maybe start playing from splash screen)
    // - Background
    // - Enemy silhouettes
    // - Label level on upper side of button.

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";
    protected static levelCheatOn = false;

    public loadScene(): void {
        // Load the menu song
        // this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
        this.load.spritesheet("lock", "cof_assets/images/lock.json")
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);

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
                text: "Choose one of the following levels to start from."
            }
        );
        subTitle.fontSize = 25;
        subTitle.textColor = Color.RED;


        // Buttons:
        let level1 = this.makeLevelBox(size.x-350, size.y-100, "Level 1");
        let level2 = this.makeLevelBox(size.x, size.y-100, "Level 2");
        let level3 = this.makeLevelBox(size.x+350, size.y-100, "Level 3");
        let level4 = this.makeLevelBox(size.x-350, size.y+200, "Level 4");
        let level5 = this.makeLevelBox(size.x, size.y+200, "Level 5");
        let level6 = this.makeLevelBox(size.x+350, size.y+200, "Level 6");

        console.log(LevelSelect.levelCheatOn)

        // Scene transitions:
        level1.onClick = () => {
            if(MainMenu.boss1Defeated || LevelSelect.levelCheatOn)
                this.sceneManager.changeToScene(COFLevel1);
        };

        level2.onClick = () => {
            if(MainMenu.boss2Defeated || LevelSelect.levelCheatOn)
                this.sceneManager.changeToScene(COFLevel2);
        };

        level3.onClick = () => {
            if(MainMenu.boss3Defeated || LevelSelect.levelCheatOn)
                this.sceneManager.changeToScene(COFLevel3);
        };

        level4.onClick = () => {
            if(MainMenu.boss4Defeated || LevelSelect.levelCheatOn)
                this.sceneManager.changeToScene(COFLevel4);
        };

        level5.onClick = () => {
            if(MainMenu.boss5Defeated || LevelSelect.levelCheatOn)
                this.sceneManager.changeToScene(COFLevel5);
        };
        
        level6.onClick = () => {
            if(MainMenu.boss6Defeated || LevelSelect.levelCheatOn)
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

        this.handleLockedLevels();
    }

    public unloadScene(): void {
    }

    public update(deltaT: number): void {
        super.update(deltaT);
        if (Input.isJustPressed(COFCheats.UNLOCK_ALL)) {
            LevelSelect.levelCheatOn = true
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
        levelBox.backgroundColor = Color.BLACK;
        levelBox.borderColor = Color.BLACK;
        levelBox.borderRadius = 0;
        levelBox.font = "PixelSimple";
        levelBox.fontSize = 20;
        levelBox.textColor = Color.RED;
        levelBox.size.set(200, 200);

        return levelBox;
    }

    private handleLockedLevels() {

        if(!LevelSelect.levelCheatOn) {

            let size = this.viewport.getHalfSize();

            if(!MainMenu.boss1Defeated) {

                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x-350, size.y-100)
            }

            if(!MainMenu.boss2Defeated) {
                
                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x, size.y-100)
            }

            if(!MainMenu.boss3Defeated) {
                
                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x+350, size.y-100)
            }

            if(!MainMenu.boss4Defeated) {
                
                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x-350, size.y+200)
            }

            if(!MainMenu.boss5Defeated) {
                
                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x, size.y+200)
            }

            if(!MainMenu.boss6Defeated) {
                
                let lock = this.add.sprite("lock", MenuLayers.MAIN)
                lock.scale.set(4, 4)
                lock.position = new Vec2(size.x+350, size.y+200)
            }
        }
    }
}