import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
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
// import FireballShaderType from "../Shaders/FireballShaderType";
// import FireballAI from "../Fireball/FireballBehavior";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";

import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { COFEvents } from "../COFEvents";

/**
 * A const object for the layer names
 */
export const COFLayers = {
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI"
} as const;

// The layers as a type
export type COFLayer = typeof COFLayers[keyof typeof COFLayers]

export default class COFLevel extends Scene {

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

    /** Collision sprite for weapon */
    protected playerWeapon: AnimatedSprite;

    /** Object pool for fire projectiles */
    // private fireballs: Array<Graphic>

    /** The enemy boss sprite */
    protected enemyBoss: AnimatedSprite;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

    private manaLabel: Label;
    private manaBar: Label;
    private manaBarBg: Label;

    private staminaLabel: Label;
    private staminaBar: Label;
    private staminaBarBg: Label;

    private enemyHealthLabel: Label;
    private enemyHealthBar: Label;
    private enemyHealthBarBg: Label;

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

        let groupNames : string[] = [
            COFPhysicsGroups.PLAYER, 
            COFPhysicsGroups.ENEMY,
            COFPhysicsGroups.WALL,
            COFPhysicsGroups.PLAYER_WEAPON
        ]
        
        let collisions : number[][] = [
            [0,0,1,0],
            [0,0,1,1],
            [1,1,0,0],
            [0,1,0,0]
        ];


        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames, collisions
        }});
        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load the player and enemy spritesheets
        this.load.spritesheet("azazel", "cof_assets/spritesheets/chain_devil.json");

        // Load the tilemap
        this.load.tilemap("level", "cof_assets/tilemaps/chainsoffurydemo2.json");

        // Load dummy enemy
        this.load.spritesheet("moondog", "cof_assets/spritesheets/moondog.json");

        // this.load.shader(
		// 	FireballShaderType.KEY,
		// 	FireballShaderType.VSHADER,
		// 	FireballShaderType.FSHADER
		// );
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        this.initializeUI();

        // this.initObjectPools();

        // Initialize the player 
        this.initializePlayer("azazel");

        // Initially disable player movement
        Input.enableInput();

        this.initializeEnemyBoss("moondog");

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
    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case COFEvents.PLAYER_SWING: {
                this.handlePlayerSwing(event.data.get("faceDir"));
                break;
            }
            case COFEvents.ENEMY_TOOK_DAMAGE: {
                this.handleBossHealthChange(event.data.get("currHealth"), event.data.get("maxHealth"));
                break;
            }
            case COFEvents.CHANGE_MANA: {
                this.handlePlayerManaChange(event.data.get("currMana"), event.data.get("maxMana"));
                break;
            }
            case COFEvents.CHANGE_STAMINA: {
                this.handlePlayerStaminaChange(event.data.get("currStamina"), event.data.get("maxStamina"));
                break;
            }
            // case COFEvents.PLAYER_HURL: {
            //     this.spawnFireball(event.data.get("faceDir"), event.data.get("pos"));
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

    /**
     * Handles when player swings.
     * 
     * @param faceDir direction player is facing, -1 for left, 1 for right
     */
    protected handlePlayerSwing(faceDir: number) {
        let playerSwingHitbox = this.player.boundary.getHalfSize().clone();
        playerSwingHitbox.x = playerSwingHitbox.x-16;
        
        let swingPosition = this.player.position.clone();
        swingPosition.x += faceDir*14;


        // This should loop through all hitable object? and fire event.
        if (this.enemyBoss.collisionShape.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
            console.log("weapon hit");
        }
    }

    // protected initObjectPools(): void {
		
	// 	// Init bubble object pool
	// 	this.fireballs = new Array(3);
	// 	for (let i = 0; i < this.fireballs.length; i++) {
	// 		this.fireballs[i] = this.add.graphic(GraphicType.RECT, COFLayers.PRIMARY, {position: new Vec2(200, 200), size: new Vec2(50, 50)});
            
    //         // Give the bubbles a custom shader
	// 		this.fireballs[i].useCustomShader(FireballShaderType.KEY);
	// 		this.fireballs[i].visible = false;
	// 		this.fireballs[i].color = Color.BLUE;

    //         // Give the bubbles AI
	// 		this.fireballs[i].addAI(FireballAI);

    //         // Give the bubbles a collider
	// 		let collider = new Circle(Vec2.ZERO, 25);
	// 		this.fireballs[i].setCollisionShape(collider);
	// 	}
    // }

    /**
     * Displays a mine on the tilemap.
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
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the player is facing
    */

    // protected spawnFireball(faceDir: number, pos: Vec2) {

    //     // Find first visible fireball
    //     let fireball: Graphic = this.fireballs.find((fireball: Graphic) => { return !fireball.visible });

    //     if(fireball)
    //     {
    //         fireball.visible = true;
    //         fireball.position.copy(pos.clone())
    //         fireball.setAIActive(true, {})
    //     }
    // }

    /**
     * 
     * 
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handlePlayerHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}

    /**
     * 
     * 
     * @param currentStamina the current stamina of the player
     * @param maxStamina the maximum stamina of the player
     */
    protected handlePlayerStaminaChange(currentStamina: number, maxStamina: number): void {
		let unit = this.staminaBarBg.size.x / maxStamina;
        
		this.staminaBar.size.set(this.staminaBarBg.size.x - unit * (maxStamina - currentStamina), this.staminaBarBg.size.y);
		this.staminaBar.position.set(this.staminaBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxStamina - currentStamina), this.staminaBarBg.position.y);
	}

    /**
     * 
     * 
     * @param currentMana the current mana of the player
     * @param maxMana the maximum mana of the player
     */
    protected handlePlayerManaChange(currentMana: number, maxMana: number): void {
		let unit = this.manaBarBg.size.x / maxMana;
        
		this.manaBar.size.set(this.manaBarBg.size.x - unit * (maxMana - currentMana), this.manaBarBg.size.y);
		this.manaBar.position.set(this.manaBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxMana - currentMana), this.manaBarBg.position.y);
	}

     /**
     * 
     * 
     * @param currentHealth the current health of the boss
     * @param maxHealth the maximum health of the boss
     */
     protected handleBossHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.enemyHealthBarBg.size.x / maxHealth;
        
		this.enemyHealthBar.size.set(this.enemyHealthBarBg.size.x - unit * (maxHealth - currentHealth), this.enemyHealthBarBg.size.y);
		this.enemyHealthBar.position.set(this.enemyHealthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.enemyHealthBarBg.position.y);

		this.enemyHealthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;

        // TODO: fire event boss_dead; play dying and dead scene before moving onto next lvl
	}



    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(COFLayers.UI);
        // Add a layer for players and enemies
        this.addLayer(COFLayers.PRIMARY);
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

        // Get the wall and destructible layers 
        this.walls = this.getTilemap("Barrier") as OrthogonalTilemap;

        // Add physics to the wall layer
        this.walls.setGroup(COFPhysicsGroups.WALL);
        this.walls.addPhysics();
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(COFEvents.PLAYER_SWING);
        this.receiver.subscribe(COFEvents.ENEMY_TOOK_DAMAGE);
        this.receiver.subscribe(COFEvents.CHANGE_STAMINA)
        this.receiver.subscribe(COFEvents.CHANGE_MANA);
        //this.receiver.subscribe(COFEvents.PLAYER_HURL)
    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {

        this.healthBar = this.createBar(120, 20, 300, 20, Color.RED);
        this.healthBarBg = this.createBarBg(120, 20, 300, 20, Color.TRANSPARENT);
        this.healthLabel = this.createBarLabel(120, 20, 300, 20, Color.BLACK, "HP");
        
        this.staminaBar = this.createBar(120, 40, 300, 20, Color.GREEN);
        this.staminaBarBg = this.createBarBg(120, 40, 300, 20, Color.TRANSPARENT);
        this.staminaLabel = this.createBarLabel(120, 40, 300, 20, Color.BLACK, "Stamina");

        this.manaBar = this.createBar(120, 60, 300, 20, Color.BLUE);
        this.manaBarBg = this.createBarBg(120, 60, 300, 20, Color.TRANSPARENT);
        this.manaLabel = this.createBarLabel(120, 60, 300, 20, Color.BLACK, "Mana");
        
        this.enemyHealthBar = this.createBar(400, 500, 800, 40, Color.RED, 28);
        this.enemyHealthBarBg = this.createBarBg(400, 500, 800, 40, Color.TRANSPARENT, 28);
        this.enemyHealthLabel = this.createBarLabel(400, 500, 800, 40, Color.BLACK, "Moon Dog", 28);

    }
    // /**
    //  * Initializes the particles system used by the player's weapon.
    //  */
    // protected initializeWeaponSystem(): void {
    // }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        this.playerSpawn = new Vec2(300, 250)

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.player.scale.set(.4, .4);
        this.player.position.copy(this.playerSpawn);

        // Give the player it's AI
        this.player.addAI(AzazelController);

        let playerHitbox = this.player.boundary.getHalfSize().clone();
        playerHitbox.x = playerHitbox.x-12;

        this.player.addPhysics(new AABB(this.player.position.clone(), playerHitbox));
        this.player.setGroup(COFPhysicsGroups.PLAYER);
    }


    protected initializeEnemyBoss(key: string): void {
        let enemySpawn = new Vec2(800,500);

        this.enemyBoss = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.enemyBoss.scale.set(1,1);
        this.enemyBoss.position.copy(enemySpawn);

        // Give enemy boss it's AI
        this.enemyBoss.addAI(MoonDogController);

        let enemyHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        enemyHitbox.x = enemyHitbox.x - 6

        this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), enemyHitbox));
        this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x-15, this.enemyBoss.boundary.getHalfSize().clone().y-15)));
        this.enemyBoss.setGroup(COFPhysicsGroups.ENEMY);
    }


    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(1.5);
        this.viewport.setBounds(0, 0, 1280, 960);
    }

    private createBar(posX: number, posY: number, sizeX: number, sizeY: number, color: Color, font?: number) : Label {
        let bar = <Label>this.add.uiElement(UIElementType.LABEL, COFLayers.UI, {position: new Vec2(posX, posY), text: ""});
        bar.size = new Vec2(sizeX, sizeY);
        bar.backgroundColor = color;     

        return bar;
    }

    private createBarBg(posX: number, posY: number, sizeX: number, sizeY: number, color: Color, font?: number) : Label{
        let barBg = <Label>this.add.uiElement(UIElementType.LABEL, COFLayers.UI, {position: new Vec2(posX, posY), text: ""});
        barBg.size = new Vec2(sizeX, sizeY);
        barBg.backgroundColor = color;
        barBg.borderColor = Color.BLACK;
        barBg.borderWidth = 3;

        return barBg;
    }

    private createBarLabel(posX: number, posY: number, sizeX: number, sizeY: number, color: Color, txt: String, font?: number) : Label {
        let barLabel = <Label>this.add.uiElement(UIElementType.LABEL, COFLayers.UI, {position: new Vec2(posX, posY), text: txt});
        barLabel.size = new Vec2(sizeX, sizeY);
        font ? barLabel.fontSize = font : barLabel.fontSize = 14;
        barLabel.font = "PixelSimple"
        barLabel.textColor = color;
        
        return barLabel;
    }

}
