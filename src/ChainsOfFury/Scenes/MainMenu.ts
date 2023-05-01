import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import COFLevel from "./COFLevel";
import Help from "./Help";
import Controls from "./Controls";
import COFLevel1 from "./COFLevel1";
import COFLevel3 from "./COFLevel3";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class MainMenu extends Scene {
    
    // TODO: Add music / sound effect?

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "cof_assets/music/cofmusic2.mp3";

    // TODO:
    // - Background
    // - Sprite/logo on top.

    public loadScene(): void {
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
        );
        title.fontSize = 35;
        title.textColor = Color.RED;


        // Buttons:

        let startGame = this.createButton(size.x, size.y+20, "Start Game");
        let levelSelect = this.createButton(size.x, size.y+100, "Level Select");
        let controls = this.createButton(size.x, size.y+180, "Controls");
        let help = this.createButton(size.x, size.y+260, "Help");

        // Scene transitions:

        startGame.onClick = () => {
            this.sceneManager.changeToScene(COFLevel1);
        };

        levelSelect.onClick = () => {
            this.sceneManager.changeToScene(LevelSelect);
        };

        controls.onClick = () => {
            this.sceneManager.changeToScene(Controls);
        };

        help.onClick = () => {
            this.sceneManager.changeToScene(Help);
        };

        // Scene has started, so start playing music
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
    }

    // Creates a button and appends it onto main layer.
    // x and y are positions of the label
    public createButton(x : number, y : number, txt : String): Button {
        let button = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(x, y),
                text: txt
            }
        );
        button.backgroundColor = Color.BLACK;
        button.borderColor = Color.BLACK;
        button.borderRadius = 0;
        button.font = "PixelSimple";
        button.fontSize = 20;
        button.textColor = Color.RED;
        button.size.set(355, 35);

        return button;
    }
}