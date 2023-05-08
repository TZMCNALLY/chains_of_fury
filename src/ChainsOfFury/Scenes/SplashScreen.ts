import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import { MenuLayers } from "./MainMenu";

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
        this.load.spritesheet("logo", "cof_assets/images/logo.json");
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
        this.playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x, size.y+200), text: "Click anywhere to start"});
        this.playBtn.backgroundColor = Color.TRANSPARENT;
        this.playBtn.borderColor = Color.RED;
        this.playBtn.borderRadius = 0;
        this.playBtn.textColor = Color.RED;

        // Display the game logo
        let logo = this.add.sprite("logo", MenuLayers.MAIN)
        logo.scale.set(.4, .4)
        logo.position = new Vec2(size.x, size.y-120)

        // Incredibly high padding so that button covers whole screen.
        this.playBtn.setPadding(new Vec2(size.x*2, size.y*4));
        this.playBtn.font = "PixelSimple";
        this.playBtn.visible = false;

        // When the play button is clicked, go to the main menu
        this.playBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, null, {viewportPosition: this.viewport.getCenter(), viewportObjective: this.viewportObjective});
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
        };

        this.blinkTimer = new Timer(500);

        this.upperLeft = new Vec2(480, 320);
        this.upperRight = new Vec2(800, 320);
        this.bottomLeft = new Vec2(480, 640);
        this.bottomRight = new Vec2(800, 640);
        this.viewportObjective = this.upperRight;
    }

    public unloadScene(): void {
        this.resourceManager.keepAudio(MainMenu.MUSIC_KEY);
        this.resourceManager.keepTilemap("level")
    }

    // Handles the viewport panning around the arena
    public updateScene(deltaT: number) {

        if(this.blinkTimer.isStopped()) {
            this.blinkTimer.start()
            this.playBtn.visible = !this.playBtn.visible
        }

        let x = this.viewport.getCenter().x
        let y = this.viewport.getCenter().y

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