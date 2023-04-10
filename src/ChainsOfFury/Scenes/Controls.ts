import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
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
    MAIN: "MAIN",
    SPRITES: "SPRITES"
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

        this.load.spritesheet("player", "cof_assets/spritesheets/chain_devil.json");  
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
                position: new Vec2(size.x, size.y-330),
                text: "Controls"
            }
        );
        title.fontSize = 50;
        title.textColor = Color.RED;

        // ================================================================================
        // Movement Section

        this.createBackground(size.x-270, size.y-200, 500, 150);

        this.createText(size.x-420, size.y-245, "W - Move Up");
        this.createText(size.x-420, size.y-215, "A - Move Left");
        this.createText(size.x-420, size.y-185, "S - Move Down");
        this.createText(size.x-420, size.y-155, "D - Move Right");

        this.createSprite(size.x-120, size.y-200, 1, 1, "player", "RUN_RIGHT");

        // Movement Section
        // ================================================================================

        // ================================================================================
        // Projectile Section

        this.createBackground(size.x+270, size.y-200, 500, 150);

        this.createText(size.x+135, size.y-245, "E -");
        this.createText(size.x+135, size.y-215, "Charges up and fires");
        this.createText(size.x+135, size.y-185, "a fireball in the");
        this.createText(size.x+135, size.y-155, "direction of the mouse");

        // TODO: Charge and shoot animation
        this.createSprite(size.x*2-160, size.y-200, 1, 1, "player", "CHARGE_RIGHT");


        // Projectile Section
        // ================================================================================

        // ================================================================================
        // Basic Attack Section

        this.createBackground(size.x-270, size.y, 500, 150);

        this.createText(size.x-420, size.y-10, "Left-Click -");
        this.createText(size.x-420, size.y+10, "Basic Swing");

        this.createSprite(size.x-120, size.y, 1, 1, "player", "ATTACK_RIGHT");

        // Basic Attack Section
        // ================================================================================

        // ================================================================================
        // Guard Section

        this.createBackground(size.x+270, size.y, 500, 150);

        this.createText(size.x+130, size.y-10, "Hold Right-Click -");
        this.createText(size.x+130, size.y+10, "Guard");

        // TODO: Guard animation
        this.createSprite(size.x*2-160, size.y, 1, 1, "player", "IDLE_RIGHT");

        // Guard Section
        // ================================================================================

        // ================================================================================
        // Combo Attack Section

        // this.createBackground(size.x-270, size.y+200, 500, 150);

        // this.createText(size.x-420, size.y+190, "Hold Left-Click -")
        // this.createText(size.x-420, size.y+210, "Combo Swing")

        // this.createSprite(size.x-120, size.y+200, 1, 1, "player", "CHARGE_RIGHT");

        // Combo Attack Section
        // ================================================================================

        // ================================================================================
        // Escape Section

        this.createBackground(size.x, size.y+200, 1050, 150);

        this.createText(size.x, size.y+190, "Esc -");
        this.createText(size.x, size.y+210, "Pauses the game");

        //this.createSprite(size.x*2-160, size.y+200, 1, 1, "player", "IDLE_RIGHT");

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
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});

        this.load.unloadAllResources();
    }

    // Creates a text label and appends it onto main layer.
    // x and y are positions of the label, and string is the text that goes inside of the label.
    public createText(x : number, y : number, txt : String): void {
        let label = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:txt});
        label.fontSize = 20;
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

    // Create animated sprite at x,y.
    // s: scale, key: key of sprite.
    public createSprite(x: number, y: number, sx: number, sy: number, key: string, animation: string) {
        let sprite = this.add.animatedSprite(key, MenuLayers.SPRITES);
        sprite.scale.set(sx, sy);
        sprite.position.set(x, y);
        sprite.animation.play(animation, true);
    }
}