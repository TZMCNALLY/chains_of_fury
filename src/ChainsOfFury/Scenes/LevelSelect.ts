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


export default class LevelSelect extends Scene {

    // TODO:
    // - Music (maybe start playing from splash screen)
    // - Background
    // - Enemy silhouettes
    // - Label level on upper side of button.

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        // Load the menu song
        // this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
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
                text: "Choose one of the following levels to play."
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

        // Scene transitions:
        level1.onClick = () => {
            this.sceneManager.changeToScene(COFLevel1);
        };

        level2.onClick = () => {
            this.sceneManager.changeToScene(COFLevel2);
        };

        level3.onClick = () => {
            this.sceneManager.changeToScene(COFLevel3);
        };

        level4.onClick = () => {
            this.sceneManager.changeToScene(COFLevel4);
        };

        level5.onClick = () => {
            this.sceneManager.changeToScene(COFLevel5);
        };
        
        level6.onClick = () => {
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
    }

    public unloadScene(): void {
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
}