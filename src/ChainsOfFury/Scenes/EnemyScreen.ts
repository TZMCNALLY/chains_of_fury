import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import { MenuLayers } from "./MainMenu";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";

// Constant for each enemy menu
export const EnemyMenus = {
    MOON_DOG: "MOONDOG_MENU",
    DARK_STALKER: "DARK_STALKER_MENU",
    LORD_REYALF: "LORD_REYALF_MENU",
    REAPER: "REAPER_MENU",
    SATANS_BLADE: "SATANS_BLADE_MENU",
    DEMON_KING: "DEMON_KING"
} as const;

export default class EnemyScreen extends Scene {

    protected enemyMenu: String;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.enemyMenu = options.enemy;
    }

    public loadScene(): void {
        this.load.spritesheet("moondog", "cof_assets/spritesheets/Enemies/moondog.json");  
        this.load.spritesheet("darkstalker", "cof_assets/spritesheets/Enemies/dark_stalker.json");
        this.load.spritesheet("mind_flayer", "cof_assets/spritesheets/Enemies/mind_flayer.json");
        this.load.spritesheet("reaper", "cof_assets/spritesheets/Enemies/reaper.json");
        this.load.spritesheet("flying_sword", "cof_assets/spritesheets/Enemies/flying_sword.json");
        this.load.spritesheet("wraith", "cof_assets/spritesheets/Enemies/wraith.json");
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);
        this.addUILayer(MenuLayers.SPRITES);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.createBackground(size.x, size.y+125, 500, 300);
        switch (this.enemyMenu) {
            case EnemyMenus.MOON_DOG: {
                this.createSprite(size.x, size.y-200, 1, 1, "moondog", "IDLE").scale.set(1.5, 1.5);
                this.createText(size.x, size.y-50, "Moon Dog", 25)
                this.createText(size.x, size.y+50, "No clue who let a dog into the tournament,", 20);
                this.createText(size.x, size.y+80, "but this dog sure knows what it's doing.", 20);
                break;
            }
            case EnemyMenus.DARK_STALKER: {
                this.createSprite(size.x, size.y-200, 1, 1, "darkstalker", "IDLE").scale.set(1.5, 1.5);
                this.createText(size.x, size.y-50, "Dark Stalker", 25)
                this.createText(size.x, size.y+50, "A warrior from a distant land.", 20);
                this.createText(size.x, size.y+80, "Does not appear to be a demon,", 20);
                this.createText(size.x, size.y+110, "but he appears to be after the crown.", 20);
                this.createText(size.x, size.y+140, "He has some interesting tricks up his sleeve.", 20);
                break;
            }
            case EnemyMenus.LORD_REYALF: {
                this.createSprite(size.x, size.y-200, 1, 1, "mind_flayer", "IDLE").scale.set(1.5, 1.5);
                this.createText(size.x, size.y-50, "Lord Reyalf", 25)
                this.createText(size.x, size.y+50, "A duke under the current demon king.", 20);
                this.createText(size.x, size.y+80, "Centuries of loyalty have paid off,", 20);
                this.createText(size.x, size.y+110, "as he has obtained the right to", 20);
                this.createText(size.x, size.y+140, "participate in this tournament.", 20);
                this.createText(size.x, size.y+170, "But considering a dog and a non-demon", 20);
                this.createText(size.x, size.y+200, "also managed to participate,", 20);
                this.createText(size.x, size.y+230, "his loyalty appears to not amount to much.", 20);
                break;
            }
        }
    }

    public unloadScene(): void {
        this.resourceManager.keepAudio(MainMenu.MUSIC_KEY);
    }

    // Creates a text label and appends it onto main layer.
    // x and y are positions of the label, string is the text that goes inside of the label, and fontSize is the font size
    public createText(x : number, y : number, txt : String, fontSize : number): Label {
        let label = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:txt});
        label.fontSize = fontSize;
        label.font = "PixelSimple";
        label.textColor = Color.RED;
        
        return label;
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

        return sprite;
    }
}
