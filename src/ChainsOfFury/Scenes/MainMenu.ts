import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import Help from "./Help";
import Controls from "./Controls";
import COFLevel1 from "./COFLevel1";
import COFLevel3 from "./COFLevel3";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { AzazelAnimations } from "../Player/AzazelController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AudioManager from "../../Wolfie2D/Sound/AudioManager";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN",
    SPRITES: "SPRITES"
} as const;

export default class MainMenu extends Scene {
    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "cof_assets/music/cofmusic2.mp3";
    protected clicked: boolean; // whether the user has clicked a button or not
    protected player: AnimatedSprite // the player sprite
    protected runSpeed: number // the speed the player sprite runs off the screen
    protected nextScene: number // number denoting which scene to transition to. 0 for start game, 1 for level select,
                                // 2 for controls, 3 for help

    public static boss1Defeated: boolean;
    public static boss2Defeated: boolean;
    public static boss3Defeated: boolean;
    public static boss4Defeated: boolean;
    public static boss5Defeated: boolean;
    public static boss6Defeated: boolean;

    public static notFromMenu = true;

    // TODO:
    // - Background
    // - Sprite/logo on top.

    public loadScene(): void {
        if(MainMenu.boss1Defeated && MainMenu.boss2Defeated && MainMenu.boss3Defeated
            && MainMenu.boss4Defeated && MainMenu.boss5Defeated && MainMenu.boss6Defeated)
            this.load.spritesheet("azazel", "cof_assets/spritesheets/Player/chain_devil_won.json");

        else
            this.load.spritesheet("azazel", "cof_assets/spritesheets/Player/chain_devil.json");
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);
        this.addUILayer(MenuLayers.SPRITES);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // let title = <Label>this.add.uiElement(
        //     UIElementType.LABEL,
        //     MenuLayers.MAIN,
        //     {
        //         position: new Vec2(size.x, size.y-120),
        //         text: "CHAINS OF FURY"
        //     }
        // );
        // title.fontSize = 35;
        // title.textColor = Color.RED;

        // Displays the player sprite on the top of the screen
        this.player = this.add.animatedSprite("azazel", MenuLayers.MAIN)
        this.player.position = new Vec2(0, size.y-120)
        this.player.animation.play(AzazelAnimations.IDLE_RIGHT, true, null)
        this.runSpeed = 8
        
        // Buttons:

        let startGame = this.createButton(size.x, size.y+20, "Start Game");
        let levelSelect = this.createButton(size.x, size.y+100, "Level Select");
        let controls = this.createButton(size.x, size.y+180, "Controls");
        let help = this.createButton(size.x, size.y+260, "Help");


        // Scene transitions:

        startGame.onClick = () => {
            if(!this.clicked) {
                this.clicked = true
                this.nextScene = 0
            }
        };

        levelSelect.onClick = () => {
            if(!this.clicked) {
                this.clicked = true
                this.nextScene = 1
            }
        };

        controls.onClick = () => {
            if(!this.clicked) {
                this.clicked = true
                this.nextScene = 2
            }
        };

        help.onClick = () => {
            if(!this.clicked) {
                this.clicked = true
                this.nextScene = 3
            }
        };

        if (MainMenu.notFromMenu) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
        }
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

    // Handles the viewport panning around the arena
    public updateScene(deltaT: number) {

        super.updateScene(deltaT)

        let size = this.viewport.getHalfSize();

        if(!this.clicked) {
            
            if(this.player.position.x < size.x) {

                this.player.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)

                if(this.viewport.getCenter().x - this.player.position.x < size.x/2)
                    this.runSpeed -= .1
                    
                this.player.position.x += this.runSpeed
            }

            else {

                this.runSpeed = .2
                this.player.animation.playIfNotAlready(AzazelAnimations.IDLE_RIGHT)
            }

        }

        else {
            
            if(this.player.position.x < this.viewport.getHalfSize().x * 2) {

                this.player.animation.playIfNotAlready(AzazelAnimations.RUN_RIGHT)
                
                if(this.runSpeed < 8)
                    this.runSpeed += .1
                
                this.player.position.x += this.runSpeed
            }

            else {

                switch(this.nextScene) {
                    
                    case 0: {
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
                        this.sceneManager.changeToScene(COFLevel1);
                        break;
                    }
                    case 1: {
                        this.sceneManager.changeToScene(LevelSelect);
                        break;
                    }
                    case 2: {
                        this.sceneManager.changeToScene(Controls);
                        break;
                    }
                    case 3: {
                        this.sceneManager.changeToScene(Help);
                        break;
                    }
                }
            }
        }
    }
}