import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import MainMenu from "./MainMenu";
import SplashScreen from "./SplashScreen";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class Help extends Scene {

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
                text: "Help"
            }
        );
        title.fontSize = 50;
        title.textColor = Color.RED;

        // ================================================================================
        // Backstory Section

        this.createBackground(size.x, size.y-175, 1150, 200);

        this.createText(size.x, size.y-250, "Backstory: Hell is a place where only one reigns supreme: the Demon King. No demon can go against his power, primarily because he possesses the Crown of Obedience.");
        this.createText(size.x, size.y-220, "All creatures of Hell must follow his rule, or be vanquished from existence by the Crown. This power is not everlasting, however. Every millennium, the crown decides upon a new owner.");
        this.createText(size.x, size.y-190, "As the time is close at hand, the current demon king announces a tournament boasting Hell's cream of the crop to fight for the throne.");
        this.createText(size.x, size.y-160, "Azazel, a vengeful demon residing in the depths of Hell, has been training with his meteor hammer for centuries, all for this moment.");
        this.createText(size.x, size.y-130, "Ever since the Demon King sentenced his father to death, Azazel had been patiently waiting for his chance at revenge.");
        this.createText(size.x, size.y-100, "And so he enters the tournament with only two goals in mind: to claim the Crown and kill the current Demon King.");

        // Backstory Section
        // ================================================================================

        // ================================================================================
        // Characters Section

        this.createBackground(size.x-200, size.y+100, 600, 350);
        this.createText(size.x-300, size.y-50, "Characters here");
        
        // Characters Section
        // ================================================================================

        // ================================================================================
        // Cheat Codes Section

        this.createBackground(size.x+200, size.y+100, 600, 350);
        this.createText(size.x+200, size.y-50, "Cheat codes here");

        // Cheat Codes Section
        // ================================================================================

        
        // ================================================================================
        // Developers Section

        this.createBackground(size.x, size.y+330, 400, 50);
        this.createText(size.x, size.y+330, "Developed by: Aaron Liang, Torin McNally, and Vincent Ke");

        // Developers Section
        // ================================================================================

        // Buttons:

        let back = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x-480, size.y+320),
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
        


        // Scene transitions:

        back.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        }

        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }

    // Creates a text label and appends it onto main layer.
    // x and y are positions of the label, and string is the text that goes inside of the label.
    public createText(x : number, y : number, txt : String): void {
        let label = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:txt});
        label.fontSize = 15;
        label.font = "PixelSimple";
        label.textColor = Color.RED;
    }

    // Creates a background label and appends it onto main layer.
    // x and y are positions of the label, l is the length of the background, and w is the width
    public createBackground(x : number, y : number, l : number, w : number): void {
        let background = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:""});
        background.size.set(l, w);
        background.borderWidth = 5;
        background.borderColor = Color.RED;
        background.backgroundColor = Color.BLACK;
    }
}