import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import SplashScreen from "./SplashScreen";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class LevelSelect extends Scene {

    // TODO:
    // - Music (maybe start playing from splash screen)
    // - Background
    // - Enemy silhouettes
    // - Label level on upper side of button.

    // public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    // public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

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
        )
        title.fontSize = 55;
        title.textColor = Color.WHITE;


        let subTitle = <Label>this.add.uiElement(
            UIElementType.LABEL,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y-250),
                text: "Choose one of the following levels to start from."
            }
        )
        subTitle.fontSize = 25;
        subTitle.textColor = Color.WHITE;


        // Buttons:

        let level1 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x-350, size.y-100),
                text: "level1"
            }
        )
        level1.backgroundColor = Color.WHITE;
        level1.borderColor = Color.WHITE;
        level1.borderRadius = 0;
        level1.font = "PixelSimple";
        level1.fontSize = 20;
        level1.textColor = Color.BLACK;
        level1.size.set(200, 200);

        
        let level2 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y-100),
                text: "level2"
            }
        )
        level2.backgroundColor = Color.WHITE;
        level2.borderColor = Color.WHITE;
        level2.borderRadius = 0;
        level2.font = "PixelSimple";
        level2.fontSize = 20;
        level2.textColor = Color.BLACK;
        level2.size.set(200, 200);


        let level3 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x+350, size.y-100),
                text: "level3"
            }
        )
        level3.backgroundColor = Color.WHITE;
        level3.borderColor = Color.WHITE;
        level3.borderRadius = 0;
        level3.font = "PixelSimple";
        level3.fontSize = 20;
        level3.textColor = Color.BLACK;
        level3.size.set(200, 200);


        let level4 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x-350, size.y+200),
                text: "level4"
            }
        )
        level4.backgroundColor = Color.WHITE;
        level4.borderColor = Color.WHITE;
        level4.borderRadius = 0;
        level4.font = "PixelSimple";
        level4.fontSize = 20;
        level4.textColor = Color.BLACK;
        level4.size.set(200, 200);


        let level5 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y+200),
                text: "level5"
            }
        )
        level5.backgroundColor = Color.WHITE;
        level5.borderColor = Color.WHITE;
        level5.borderRadius = 0;
        level5.font = "PixelSimple";
        level5.fontSize = 20;
        level5.textColor = Color.BLACK;
        level5.size.set(200, 200);


        let level6 = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x+350, size.y+200),
                text: "level6"
            }
        )
        level6.backgroundColor = Color.WHITE;
        level6.borderColor = Color.WHITE;
        level6.borderRadius = 0;
        level6.font = "PixelSimple";
        level6.fontSize = 20;
        level6.textColor = Color.BLACK;
        level6.size.set(200, 200);


        // Scene transitions:

        level1.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        level2.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        level3.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        level4.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        level5.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }
        
        level6.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }
}