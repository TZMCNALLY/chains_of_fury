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
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN",
    SPRITES: "SPRITES"
} as const;

export default class Controls extends Scene {

    // public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    // public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        // Load the menu song
        // this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);

        this.load.spritesheet("player", "cof_assets/spritesheets/Player/chain_devil.json");  
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

        this.createSprite(size.x-140, size.y-200, 1, 1, "player", "RUN_RIGHT");

        // Movement Section
        // ================================================================================

        // ================================================================================
        // Dash Section

        this.createBackground(size.x+270, size.y-200, 500, 150);

        this.createText(size.x+140, size.y-215, "Shift (while moving) -");
        this.createText(size.x+140, size.y-185, "Dash");

        this.createSprite(size.x*2-180, size.y-200, 1, 1, "player", "RUN_RIGHT");

        // Dash Section
        // ================================================================================

        // ================================================================================
        // Basic Attack Section

        this.createBackground(size.x-270, size.y, 500, 150);

        this.createText(size.x-420, size.y-15, "Left-Click -");
        this.createText(size.x-420, size.y+15, "Basic Swing");

        this.createSprite(size.x-140, size.y, 1, 1, "player", "ATTACK_RIGHT");

        // Basic Attack Section
        // ================================================================================

        // ================================================================================
        // Projectile Section

        this.createBackground(size.x+270, size.y+100, 500, 350);

        this.createText(size.x+125, size.y-35, "E -");
        this.createText(size.x+125, size.y-5, "Throws a fireball");
        this.createText(size.x+125, size.y+25, "in the direction");
        this.createText(size.x+125, size.y+55, "of the mouse.");
        this.createText(size.x+125, size.y+85, "If the player");
        this.createText(size.x+125, size.y+115, "right-clicks while");
        this.createText(size.x+125, size.y+145, "a fireball is active,");
        this.createText(size.x+125, size.y+175, "the player is");
        this.createText(size.x+125, size.y+205, "teleported to the");
        this.createText(size.x+125, size.y+235, "location of the fireball");

        this.createSprite(size.x*2-180, size.y+100, 1, 1, "player", "CHARGE_RIGHT");

        // Projectile Section
        // ================================================================================

        // ================================================================================
        // Extras Section

        this.createBackground(size.x-270, size.y+200, 500, 150);

        this.createText(size.x-270, size.y+185, "Esc -");
        this.createText(size.x-270, size.y+215, "Pauses the game");

        // Extras Section
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
    }

    public unloadScene(): void {
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