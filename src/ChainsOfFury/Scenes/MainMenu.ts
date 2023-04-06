import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import SplashScreen from "./SplashScreen";
import COFLevel from "./COFLevel";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class MainMenu extends Scene {

    // TODO:
    // - Music (maybe start playing from splash screen)
    // - Background
    // - Sprite/logo on top.

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
                position: new Vec2(size.x, size.y-120),
                text: "CHAINS OF FURY"
            }
        )
        title.fontSize = 35;
        title.textColor = Color.WHITE;


        // Buttons:

        let startGame = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y+20),
                text: "Start Game"
            }
        )
        startGame.backgroundColor = Color.WHITE;
        startGame.borderColor = Color.WHITE;
        startGame.borderRadius = 0;
        startGame.font = "PixelSimple";
        startGame.fontSize = 20;
        startGame.textColor = Color.BLACK;
        startGame.size.set(355, 35);

        
        let levelSelect = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y+100),
                text: "Level Select"
            }
        )
        levelSelect.backgroundColor = Color.WHITE;
        levelSelect.borderColor = Color.WHITE;
        levelSelect.borderRadius = 0;
        levelSelect.font = "PixelSimple";
        levelSelect.fontSize = 20;
        levelSelect.textColor = Color.BLACK;
        levelSelect.size.set(355, 35);


        let controls = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y+180),
                text: "Controls"
            }
        )
        controls.backgroundColor = Color.WHITE;
        controls.borderColor = Color.WHITE;
        controls.borderRadius = 0;
        controls.font = "PixelSimple";
        controls.fontSize = 20;
        controls.textColor = Color.BLACK;
        controls.size.set(355, 35);


        let help = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y+260),
                text: "Help"
            }
        )
        help.backgroundColor = Color.WHITE;
        help.borderColor = Color.WHITE;
        help.borderRadius = 0;
        help.font = "PixelSimple";
        help.fontSize = 20;
        help.textColor = Color.BLACK;
        help.size.set(355, 35);


        // Scene transitions:

        startGame.onClick = () => {
            this.sceneManager.changeToScene(COFLevel);
        }

        levelSelect.onClick = () => {
            this.sceneManager.changeToScene(LevelSelect);
        }

        controls.onClick = () => {
            this.sceneManager.changeToScene(SplashScreen);
        }

        help.onClick = () => {
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