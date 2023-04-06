import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AzazelController from "../Player/AzazelController";
//import PlayerWeapon from "../Player/PlayerWeapon";

//import { HW3Events } from "../HW3Events";
//import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
//import HW3FactoryManager from "../Factory/HW3FactoryManager";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";

/**
 * A const object for the layer names
 */
export const HW3Layers = {
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI"
} as const;

// The layers as a type
export type HW3Layer = typeof HW3Layers[keyof typeof HW3Layers]

export default class HW3Level extends Scene {

    /** Overrride the factory manager */
    //public add: HW3FactoryManager;

    /** The particle system used for the player's weapon */
    //protected playerWeaponSystem: PlayerWeapon
    /** The key for the player's animated sprite */
    protected playerSpriteKey: string;
    /** The animated sprite that is the player */
    protected player: AnimatedSprite;
    /** The player's spawn position */
    protected playerSpawn: Vec2;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    protected destructibleLayerKey: string;
    protected wallsLayerKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The destrubtable layer of the tilemap */
    protected destructable: OrthogonalTilemap;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    /** Sound and music */
    protected levelMusicKey: string;
    protected jumpAudioKey: string;
    protected tileDestroyedAudioKey: string;
    protected dyingAudioKey: string;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        //let groupNames : string[] = [HW3PhysicsGroups.GROUND, HW3PhysicsGroups.PLAYER, HW3PhysicsGroups.PLAYER_WEAPON, HW3PhysicsGroups.DESTRUCTABLE];
        super(viewport, sceneManager, renderingManager, options);
        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load the player and enemy spritesheets
        this.load.spritesheet("azazel", "cof_assets/spritesheets/chain_devil.json");

        // Load the tilemap
        this.load.tilemap("level", "cof_assets/tilemaps/chainsoffurydemo1.json");
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the sprite and particle system for the players weapon 
        //this.initializeWeaponSystem();

        this.initializeUI();

        // Initialize the player 
        this.initializePlayer("azazel");
        //this.playerWeaponSystem.setController = this.player.ai;

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        
        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        //this.initializeLevelEnds();

        // this.levelTransitionTimer = new Timer(500);
        // this.levelEndTimer = new Timer(3000, () => {
        //     // After the level end timer ends, fade to black and then go to the next scene
        //     this.levelTransitionScreen.tweens.play("fadeIn");
        // });

        // Initially disable player movement
        Input.enableInput();

        //this.player.setGroup(HW3PhysicsGroups.PLAYER);
    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // Handle all game events
        // while (this.receiver.hasNextEvent()) {
        //     this.handleEvent(this.receiver.getNextEvent());
        // }
        console.log("lego")
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            // case HW3Events.PLAYER_ENTERED_LEVEL_END: {
            //     this.handleEnteredLevelEnd();
            //     break;
            // }
            // // When the level starts, reenable user input
            // case HW3Events.LEVEL_START: {
            //     Input.enableInput();
            //     break;
            // }
            // // When the level ends, change the scene to the next level
            // case HW3Events.LEVEL_END: {
            //     this.sceneManager.changeToScene(this.nextLevel);
            //     break;
            // }
            // case HW3Events.HEALTH_CHANGE: {
            //     this.handleHealthChange(event.data.get("curhp"), event.data.get("maxhp"));
            //     break;
            // }
            // case HW3Events.PLAYER_DEAD: {
            //     this.sceneManager.changeToScene(MainMenu);
            //     break;
            // }
            // case HW3Events.HIT_TILE: {
            //     this.handleParticleHit(event.data.get("node"));
            //     break;
            // }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }

    /* Handlers for the different events the scene is subscribed to */

    /**
     * Handle particle hit events
     * @param particleId the id of the particle
     */
    protected handleParticleHit(particleId: number): void {
        //let particles = this.playerWeaponSystem.getPool();

        //let particle = particles.find(particle => particle.id === particleId);
        // if (particle !== undefined) {
        //     // Get the destructable tilemap
        //     let tilemap = this.destructable;

        //     let min = new Vec2(particle.sweptRect.left, particle.sweptRect.top);
        //     let max = new Vec2(particle.sweptRect.right, particle.sweptRect.bottom);

        //     // Convert the min/max x/y to the min and max row/col in the tilemap array
        //     let minIndex = tilemap.getColRowAt(min);
        //     let maxIndex = tilemap.getColRowAt(max);

        //     // Loop over all possible tiles the particle could be colliding with 
        //     for(let col = minIndex.x; col <= maxIndex.x; col++){
        //         for(let row = minIndex.y; row <= maxIndex.y; row++){
        //             // If the tile is collideable -> check if this particle is colliding with the tile
        //             if(tilemap.isTileCollidable(col, row) && this.particleHitTile(tilemap, particle, col, row)){
        //                 this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: this.tileDestroyedAudioKey, loop: false, holdReference: false });
        //                 // TODO Destroy the tile
        //                 tilemap.setTileAtRowCol(new Vec2(col,row), 0);
        //             }
        //         }
        //     }
        // }
    }

    /**
     * Checks if a particle hit the tile at the (col, row) coordinates in the tilemap.
     * 
     * @param tilemap the tilemap
     * @param particle the particle
     * @param col the column the 
     * @param row the row 
     * @returns true of the particle hit the tile; false otherwise
     */
    protected particleHitTile(tilemap: OrthogonalTilemap, particle: Particle, col: number, row: number): boolean {
        // TODO detect whether a particle hit a tile
        return true;
    }

    /**
     * Handle the event when the player enters the level end area.
     */
    // protected handleEnteredLevelEnd(): void {
    //     // If the timer hasn't run yet, start the end level animation
    //     if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
    //         this.levelEndTimer.start();
    //         this.levelEndLabel.tweens.play("slideIn");
    //     }
    // }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     * 
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handleHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}

    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(HW3Layers.UI);
        // Add a layer for players and enemies
        this.addLayer(HW3Layers.PRIMARY);
    }
    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    protected initializeTilemap(): void {
        // if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
        //     throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        // }
        // Add the tilemap to the scene
        this.add.tilemap("level", new Vec2(2, 2));

        // if (this.destructibleLayerKey === undefined || this.wallsLayerKey === undefined) {
        //     throw new Error("Make sure the keys for the destuctible layer and wall layer are both set");
        // }

        // // Get the wall and destructible layers 
        // this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        // this.destructable = this.getTilemap(this.destructibleLayerKey) as OrthogonalTilemap;

        // // Add physics to the wall layer
        // this.walls.addPhysics();
        // // Add physics to the destructible layer of the tilemap
        // this.destructable.addPhysics();

        // this.destructable.setTrigger(HW3PhysicsGroups.PLAYER_WEAPON,HW3Events.HIT_TILE,null);
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        // this.receiver.subscribe(HW3Events.PLAYER_ENTERED_LEVEL_END);
        // this.receiver.subscribe(HW3Events.LEVEL_START);
        // this.receiver.subscribe(HW3Events.LEVEL_END);
        // this.receiver.subscribe(HW3Events.HEALTH_CHANGE);
        // this.receiver.subscribe(HW3Events.PLAYER_DEAD);
        // this.receiver.subscribe(HW3Events.HIT_TILE);
    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {

        // HP Label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(205, 20), text: "HP "});
		this.healthLabel.size.set(300, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";

        // HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 20), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

        // HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 20), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;

        // End of level label (start off screen)
        // this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, { position: new Vec2(-300, 100), text: "Level Complete" });
        // this.levelEndLabel.size.set(1200, 60);
        // this.levelEndLabel.borderRadius = 0;
        // this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        // this.levelEndLabel.textColor = Color.WHITE;
        // this.levelEndLabel.fontSize = 48;
        // this.levelEndLabel.font = "PixelSimple";
    }
    /**
     * Initializes the particles system used by the player's weapon.
     */
    // protected initializeWeaponSystem(): void {
    //     this.playerWeaponSystem = new PlayerWeapon(30, Vec2.ZERO, 1000, 3, 0, 30);
    //     this.playerWeaponSystem.initializePool(this, HW3Layers.PRIMARY);
    // }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        this.playerSpawn = new Vec2(100, 100)
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, HW3Layers.PRIMARY);
        this.player.scale.set(0.25, 0.25);
        this.player.position.copy(this.playerSpawn);

        // Give the player it's AI
        this.player.addAI(AzazelController)
    }
    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(2);
        this.viewport.setBounds(0, 0, 512, 512);
    }
    /**
     * Initializes the level end area
     */
    // protected initializeLevelEnds(): void {
    //     if (!this.layers.has(HW3Layers.PRIMARY)) {
    //         throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
    //     }
        
    //     this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelEndPosition, size: this.levelEndHalfSize });
    //     this.levelEndArea.addPhysics(undefined, undefined, false, true);
    //     this.levelEndArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_ENTERED_LEVEL_END, null);
    //     this.levelEndArea.color = new Color(255, 0, 255, .20);
        
    // }
}