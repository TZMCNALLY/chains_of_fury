import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import MainMenu from "./MainMenu";
import SplashScreen from "./SplashScreen";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class Controls extends Scene {

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
                position: new Vec2(size.x, size.y-330),
                text: "Controls"
            }
        )
        title.fontSize = 50;
        title.textColor = Color.RED;

        // ================================================================================
        // Movement Section

        this.createBackground(size.x-270, size.y-200, 500, 150);

        this.createText(size.x-420, size.y-245, "W - Move Up")
        this.createText(size.x-420, size.y-215, "A - Move Left")
        this.createText(size.x-420, size.y-185, "S - Move Down")
        this.createText(size.x-420, size.y-155, "D - Move Right")

        // Movement Section
        // ================================================================================

        // ================================================================================
        // Projectile Section

        this.createBackground(size.x+270, size.y-200, 500, 150);

        this.createText(size.x+80, size.y-245, "Hold E -")
        this.createText(size.x+135, size.y-215, "Charges up a projectile")
        this.createText(size.x+110, size.y-185, "Release E - Fires")
        this.createText(size.x+170, size.y-155, "projectile in direction of mouse")

        // Projectile Section
        // ================================================================================

        // ================================================================================
        // Basic Attack Section

        this.createBackground(size.x-270, size.y, 500, 150);

        this.createText(size.x-420, size.y-10, "Left-Click -")
        this.createText(size.x-420, size.y+10, "Basic Swing")

        // Basic Attack Section
        // ================================================================================

        // ================================================================================
        // Guard Section

        this.createBackground(size.x+270, size.y, 500, 150);

        this.createText(size.x+130, size.y-10, "Hold Right-Click -")
        this.createText(size.x+130, size.y+10, "Guard")

        // Guard Section
        // ================================================================================

        // ================================================================================
        // Combo Attack Section

        this.createBackground(size.x-270, size.y+200, 500, 150);

        this.createText(size.x-420, size.y+190, "Hold Left-Click -")
        this.createText(size.x-420, size.y+210, "Combo Swing")

        // Combo Attack Section
        // ================================================================================

        // ================================================================================
        // Escape Section

        this.createBackground(size.x+270, size.y+200, 500, 150);

        this.createText(size.x+130, size.y+190, "Esc -")
        this.createText(size.x+130, size.y+210, "Pauses the game")

        // Escape Section
        // ================================================================================

        // Buttons:

        let back = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x-480, size.y+340),
                text: "Back"
            }
        )
        back.backgroundColor = Color.BLACK;
        back.borderColor = Color.BLACK;
        back.borderRadius = 0;
        back.font = "PixelSimple";
        back.fontSize = 30;
        back.textColor = Color.RED;
        back.size.set(100, 60);
        


        // Scene transitions:

        back.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        }

        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }

    // Creates a text label and appends it onto main layer.
    // x and y are positions of the label, and string is the text that goes inside of the label.
    public createText(x : number, y : number, txt : String): void {
        let label = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:txt})
        label.fontSize = 20;
        label.font = "PixelSimple";
        label.textColor = Color.RED;
    }

    // Creates a background label and appends it onto main layer.
    // x and y are positions of the label, l is the length of the background, and w is the width
    public createBackground(x : number, y : number, l : number, w : number): void {
        let background = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:""})
        background.size.set(l, w);
        background.borderWidth = 10;
        background.borderColor = Color.RED;
        background.backgroundColor = Color.BLACK;
    }
}