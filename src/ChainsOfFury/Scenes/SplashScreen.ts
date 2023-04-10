import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class SplashScreen extends Scene {

    // TODO: Add music / sound effect?

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

        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x, size.y+200), text: "Click anywhere to start"});
        playBtn.backgroundColor = Color.TRANSPARENT;
        playBtn.borderColor = Color.RED;
        playBtn.borderRadius = 0;
        playBtn.textColor = Color.RED;

        // TODO: Add logo and maybe background image.

        // Incredibly high padding so that button covers whole screen.
        playBtn.setPadding(new Vec2(size.x*2, size.y*2));
        playBtn.font = "PixelSimple";

        // When the play button is clicked, go to the main menu
        playBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };

        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }
}