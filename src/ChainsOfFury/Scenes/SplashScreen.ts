import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class SplashScreen extends Scene {

    protected playBtn: Button;
    protected blinkTimer: Timer;
    protected upperRight: Vec2;
    protected upperLeft: Vec2;
    protected bottomRight: Vec2;
    protected bottomLeft: Vec2;
    protected viewportObjective: Vec2; // the postition that the viewport is moving towards

    public loadScene(): void {
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
        this.load.tilemap("level", "cof_assets/tilemaps/chainsoffurydemo2.json");

    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);

        this.add.tilemap("level", new Vec2(2, 2));

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setZoomLevel(1.25);
        this.viewport.setBounds(0, 0, 1280, 960);
        this.viewport.setCenter(480, 320)

        // Create a play button
        this.playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(400, 500), text: "Click anywhere to start"});
        this.playBtn.backgroundColor = Color.TRANSPARENT;
        this.playBtn.borderColor = Color.RED;
        this.playBtn.borderRadius = 0;
        this.playBtn.textColor = Color.RED;

        // TODO: Add logo and maybe background image.

        // Incredibly high padding so that button covers whole screen.
        this.playBtn.setPadding(new Vec2(size.x*2, size.y*4));
        this.playBtn.font = "PixelSimple";

        // When the play button is clicked, go to the main menu
        this.playBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
        };

        this.blinkTimer = new Timer(200);

        this.upperLeft = new Vec2(480, 320);
        this.upperRight = new Vec2(800, 320);
        this.bottomLeft = new Vec2(480, 640);
        this.bottomRight = new Vec2(800, 640);
        this.viewportObjective = this.upperRight;
    }

    public unloadScene(): void {
        this.resourceManager.keepAudio(MainMenu.MUSIC_KEY);
    }

    public updateScene(deltaT: number) {

        let x = this.viewport.getCenter().x
        let y = this.viewport.getCenter().y

        console.log(x)
        console.log(y)

        if(this.viewportObjective == this.upperLeft) {

            if(this.viewport.getCenter().equals(this.upperLeft))
                this.viewportObjective = this.upperRight;

            else
                this.viewport.setFocus(new Vec2(x - 1, y - 1))
        }

        else if(this.viewportObjective == this.upperRight) {

            if(this.viewport.getCenter().equals(this.upperRight))
                this.viewportObjective = this.bottomLeft;

            else
                this.viewport.setFocus(new Vec2(x + 1, y))
        }

        else if(this.viewportObjective == this.bottomLeft) {

            if(this.viewport.getCenter().equals(this.bottomLeft))
                this.viewportObjective = this.bottomRight;

            else {
                
                let dir = (this.upperRight.dirTo(this.bottomLeft)).scale(deltaT)
                this.viewport.setFocus(new Vec2(x - 1, y + 1))
                console.log(dir)
            }

        }

        else if(this.viewportObjective == this.bottomRight) {

            if(this.viewport.getCenter().equals(this.bottomRight))
                this.viewportObjective = this.upperLeft;

            else
                this.viewport.setFocus(new Vec2(x + 1, y))
        }
    }
}