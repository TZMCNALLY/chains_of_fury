import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import EnemyScreen from "./EnemyScreen";
import MainMenu from "./MainMenu";
import { MenuLayers } from "./MainMenu";
import { EnemyMenus } from "./EnemyScreen";

export default class Help extends Scene {
    public loadScene(): void {
        // this.load.spritesheet("moondog_silhouette", "cof_assets/spritesheets/Silhouettes/moondog_silhouette.json");  
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
                text: "Help"
            }
        );
        title.fontSize = 50;
        title.textColor = Color.RED;

        // ================================================================================
        // Backstory Section

        this.createBackground(size.x, size.y-127.5, 1150, 350);

        this.createText(size.x, size.y-270, "Backstory: Hell is a place where only one reigns supreme: the Demon King.");
        this.createText(size.x, size.y-230, "No demon can go against his power, primarily because he possesses the Crown of Obedience.");
        this.createText(size.x, size.y-190, "All creatures of Hell must follow his rule, or be vanquished from existence by the Crown.");
        this.createText(size.x, size.y-150, "This power is not everlasting, however. Every millennium, the crown decides upon a new owner.");
        this.createText(size.x, size.y-110, "As the time is close at hand, the current demon king announces a tournament boasting Hell's cream of the crop to fight for the throne.");
        this.createText(size.x, size.y-70, "Azazel, a vengeful demon residing in the depths of Hell, has been training with his meteor hammer for centuries, all for this moment.");
        this.createText(size.x, size.y-30, "Ever since the Demon King sentenced his father to death, Azazel had been patiently waiting for his chance at revenge.");
        this.createText(size.x, size.y+10, "And so he enters the tournament with only two goals in mind: to claim the Crown and kill the current Demon King.");

        // Backstory Section
        // ================================================================================

        // ================================================================================
        // Enemies Section

        this.createBackground(size.x-170, size.y+175, 800, 200);
        this.createText(size.x-170, size.y+115, "Enemies");
        
        MainMenu.boss1Unlocked ? this.createText(size.x-425, size.y+165, "Moon Dog").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.MOON_DOG})}
                               : this.createText(size.x-425, size.y+165, "???")

        MainMenu.boss2Unlocked ? this.createText(size.x-170, size.y+165, "Dark Stalker").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.DARK_STALKER})}
                               : this.createText(size.x-170, size.y+165, "???")

        MainMenu.boss3Unlocked ? this.createText(size.x+85, size.y+165, "Lord Reyalf").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.LORD_REYALF})}
                               : this.createText(size.x+85, size.y+165, "???")

        MainMenu.boss4Unlocked ? this.createText(size.x-425, size.y+225, "Reaper").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.REAPER})}
                               : this.createText(size.x-425, size.y+225, "???")

        MainMenu.boss5Unlocked ? this.createText(size.x-170, size.y+225, "Satan's Blade").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.SATANS_BLADE})}
                               : this.createText(size.x-170, size.y+225, "???")

        MainMenu.boss6Unlocked ? this.createText(size.x+85, size.y+225, "Demon King").onClick = () => {this.sceneManager.changeToScene(EnemyScreen, null, {enemy: EnemyMenus.DEMON_KING})}
                               : this.createText(size.x+85, size.y+225, "???")
        
        // Enemies Section
        // ================================================================================

        // ================================================================================
        // Cheat Codes Section

        this.createBackground(size.x+420, size.y+175, 300, 200);
        this.createText(size.x+420, size.y+105, "Cheat codes");
        this.createText(size.x+420, size.y+135, "O - Infinite Damage");
        this.createText(size.x+420, size.y+165, "P - Infinite Health");
        this.createText(size.x+420, size.y+195, "I - Unlock All Levels")

        // Cheat Codes Section
        // ================================================================================

        
        // ================================================================================
        // Developers Section

        this.createBackground(size.x, size.y+330, 550, 50);
        this.createText(size.x, size.y+330, "Developed by: Aaron Liang, Torin McNally, and Vincent Ke");

        // Developers Section
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
            MainMenu.notFromMenu = false;
            this.sceneManager.changeToScene(MainMenu);
        }
    }

    public unloadScene(): void {
    }

    // Creates a text label and appends it onto main layer.
    // x and y are positions of the label, and string is the text that goes inside of the label.
    public createText(x : number, y : number, txt : String): Label {
        let label = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.MAIN,{position: new Vec2(x, y), text:txt});
        label.fontSize = 20;
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
        let sprite = this.add.animatedSprite(key, MenuLayers.MAIN);
        sprite.scale.set(sx, sy);
        sprite.position.set(x, y);
        sprite.animation.play(animation);
    }
}