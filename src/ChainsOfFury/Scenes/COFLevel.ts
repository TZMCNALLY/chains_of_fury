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
import Sprite from '../../Wolfie2D/Nodes/Sprites/Sprite';
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AzazelController, { AzazelTweens } from '../Player/AzazelController';
import FireballShaderType from "../Shaders/FireballShaderType";
import FireballAI from "../Fireball/FireballBehavior";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import FireballBehavior from "../Fireball/FireballBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { COFEvents } from "../COFEvents";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import PlayerController from '../../demos/PlatformerPlayerController';
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { MindFlayerAnimation } from "../Enemy/MindFlayer/MindFlayerController";

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

/**
 * Consts for the level entities
 */
export const COFEntities = {
    BOSS: "BOSS",
    MINION: "MINION"
} as const;

export default class COFLevel extends Scene {

    //TODO: ADD KEY STRINGS TO DATA (player, boss, etc.)

    public static FIREBALL_KEY = "FIREBALL";
    public static FIREBALL_PATH = "cof_assets/spritesheets/fireball.json";

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
    private fireballs: Array<AnimatedSprite>;

    /** The enemy boss sprite */
    protected enemyBoss: AnimatedSprite;

    /** Object pool for fire projectiles */
    // private fireballs: Array<Graphic>

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

    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

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
            COFPhysicsGroups.ENEMY_CONTACT_DMG,
            COFPhysicsGroups.WALL,
            COFPhysicsGroups.PLAYER_WEAPON,
            COFPhysicsGroups.FIREBALL,
            COFPhysicsGroups.ENEMY_PROJECTILE
        ]
        
        let collisions : number[][] = [
            [0,0,0,1,0,1,1],
            [0,0,0,1,1,1,0],
            [0,0,0,1,1,1,0],
            [1,1,1,0,0,1,1],
            [0,1,1,0,0,0,0],
            [1,1,1,1,0,0,0],
            [1,0,0,1,0,0,0]
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

        this.load.spritesheet("fireball", "cof_assets/spritesheets/fireball.json")
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        this.initializePlayerUI();

        // Initialize the player 
        this.initializePlayer("azazel");

        this.initObjectPools();

        // Enable player movement
        Input.enableInput();

        // this.initializeEnemyBoss("moondog", MoonDogController);

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();

        this.initializeLevelEndUI();
        
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
            case COFEvents.BOSS_TOOK_DAMAGE: {
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
            case COFEvents.PLAYER_HURL: {
                this.spawnFireball(event.data.get("faceDir"));
                break;
            }
            case COFEvents.PLAYER_TELEPORT: {
                this.handlePlayerTeleportation();
                break;
            }
            case COFEvents.FIREBALL_HIT_WALL: {
                this.despawnFireballs(event.data.get("node"));
                break;
            }
            case COFEvents.FIREBALL_HIT_ENEMY: {
                this.despawnFireballs(event.data.get("node"));
                break;
            }
            case COFEvents.PLAYER_TOOK_DAMAGE: {
                this.handlePlayerHealthChange(event.data.get("currHealth"), event.data.get("maxHealth"));
                break;
            }
            case COFEvents.PLAYER_DEAD: {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case COFEvents.MINION_DEAD: {
                this.handleMinionDead(event.data.get("id"));
                break;
            }
            case COFEvents.BOSS_DEFEATED: {
                this.handleLevelEnd();
                break;
            }
            // When the boss is defeated, change the scene to fight the next boss
            case COFEvents.LEVEL_END: {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
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
            this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.enemyBoss.id, entity: COFEntities.BOSS});
        }
    }
    protected initObjectPools(): void {
		
		// Init bubble object pool
		this.fireballs = new Array(3);
		for (let i = 0; i < this.fireballs.length; i++) {
			this.fireballs[i] = this.add.animatedSprite("fireball", COFLayers.PRIMARY);

            // Make our fireballs inactive by default
			this.fireballs[i].visible = false;

			// Assign them fireball ai
			this.fireballs[i].addAI(FireballBehavior);

            this.fireballs[i].setGroup(COFPhysicsGroups.FIREBALL);
			this.fireballs[i].scale.set(1.5, 1.5);
	    }
    }
   
    /**
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the player is facing
    */

    protected spawnFireball(faceDir: Vec2) {
        for(let i = 0; i < this.fireballs.length; i++) {

            if(!this.fireballs[i].visible) {

                // Bring this fireball to life
                this.fireballs[i].visible = true;

                // Set the velocity to be in the direction of the mouse
                faceDir.x *= 400;
                faceDir.y *= 400;

                (this.fireballs[i]._ai as FireballBehavior).velocity = faceDir

                // Set the starting position of the fireball
                this.fireballs[i].position.copy(this.player.position);

                // Give physics to this fireball
                let fireballHitbox = new AABB(this.player.position.clone(), this.fireballs[i].boundary.getHalfSize().clone());
                this.fireballs[i].addPhysics(fireballHitbox);
                this.fireballs[i].setGroup(COFPhysicsGroups.FIREBALL);
                break;
            }
        }
    }

    protected despawnFireballs(node: number) : void {
        for(let i = 0; i < this.fireballs.length; i++) {

            if(this.fireballs[i].id == node) {

                this.fireballs[i].position.copy(Vec2.ZERO);
                this.fireballs[i].visible = false;
                break;
            }
        }
    }

    // should be overriden inside of respective levels
    protected handleMinionDead(id: number): void{
    }

    protected handleLevelEnd(): void {
        this.levelEndLabel.tweens.play("slideIn")
    }

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

    protected handlePlayerTeleportation(): void {

        var fireball; // the fireball to teleport to

        // Find the most recently thrown visible fireball
        for(let i = 2; i >= 0; i--) {

            if(this.fireballs[i].visible) {
                fireball = this.fireballs[i];
                break;
            }
        }

        // If no fireball was thrown, then teleportation can't happen
        if(fireball == undefined)
            return;

        this.player.position.copy(fireball.position);

        // Keeps player from clipping out of bounds
        this.player.position.x = MathUtils.clamp(this.player.position.x, 232, 1030);
        this.player.position.y = MathUtils.clamp(this.player.position.y, 186, 776);

        this.despawnFireballs(fireball.id);
        this.player.tweens.play(AzazelTweens.TELEPORTED);
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
        this.walls.addPhysics();
        this.walls.setGroup(COFPhysicsGroups.WALL);
        this.walls.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_WALL, null);
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, COFEvents.ENEMY_PROJECTILE_HIT_WALL, null);
        // Allows a trigger to happen when boss charges into the wall.
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_CONTACT_DMG, COFEvents.ENEMY_STUNNED, null);
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(COFEvents.PLAYER_SWING);
        this.receiver.subscribe(COFEvents.BOSS_TOOK_DAMAGE);
        this.receiver.subscribe(COFEvents.CHANGE_STAMINA);
        this.receiver.subscribe(COFEvents.CHANGE_MANA);
        this.receiver.subscribe(COFEvents.PLAYER_HURL);
        this.receiver.subscribe(COFEvents.PLAYER_TELEPORT);
        this.receiver.subscribe(COFEvents.FIREBALL_HIT_WALL);
        this.receiver.subscribe(COFEvents.FIREBALL_HIT_ENEMY);
        this.receiver.subscribe(COFEvents.PLAYER_TOOK_DAMAGE);
        this.receiver.subscribe(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        this.receiver.subscribe(COFEvents.ENEMY_PROJECTILE_HIT_WALL)
        this.receiver.subscribe(COFEvents.PLAYER_DEAD);
        this.receiver.subscribe(COFEvents.MINION_DEAD);
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
        this.receiver.subscribe(COFEvents.LEVEL_END);
    }

    /**
     * Adds in any necessary player UI to the game.
     */
    protected initializePlayerUI(): void {

        this.healthBar = this.createBar(120, 20, 300, 20, Color.GREEN);
        this.healthBarBg = this.createBarBg(120, 20, 300, 20, Color.TRANSPARENT);
        this.healthLabel = this.createBarLabel(120, 20, 300, 20, Color.BLACK, "HP");
        
        this.staminaBar = this.createBar(120, 40, 300, 20, Color.ORANGE);
        this.staminaBarBg = this.createBarBg(120, 40, 300, 20, Color.TRANSPARENT);
        this.staminaLabel = this.createBarLabel(120, 40, 300, 20, Color.BLACK, "Stamina");

        this.manaBar = this.createBar(120, 60, 300, 20, Color.BLUE);
        this.manaBarBg = this.createBarBg(120, 60, 300, 20, Color.TRANSPARENT);
        this.manaLabel = this.createBarLabel(120, 60, 300, 20, Color.BLACK, "Mana");
    }

    /**
     * Adds in any necessary boss UI to the game.
     */
    protected initializeBossUI(bossName : String): void {
        this.enemyHealthBar = this.createBar(400, 500, 800, 40, Color.RED, 28);
        this.enemyHealthBarBg = this.createBarBg(400, 500, 800, 40, Color.TRANSPARENT, 28);
        this.enemyHealthLabel = this.createBarLabel(400, 500, 800, 40, Color.BLACK, bossName, 28);
    }

    protected initializeLevelEndUI(): void {

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, COFLayers.UI, { position: new Vec2(-300, 100), text: "Level Complete" });
        this.levelEndLabel.size.set(800, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: COFEvents.LEVEL_END
        });
    }

    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        this.playerSpawn = new Vec2(300, 250);

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.player.scale.set(.4, .4);
        this.player.position.copy(this.playerSpawn);

        // Give the player it's AI
        this.player.addAI(AzazelController);

        let playerHitbox = this.player.boundary.getHalfSize().clone();
        playerHitbox.x = playerHitbox.x-15;

        this.player.tweens.add(AzazelTweens.TELEPORTED, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI * 2,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.scaleX,
                    start: .05,
                    end: .4,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
                {
                    property: TweenableProperties.scaleY,
                    start: .05,
                    end: .4,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                }
            ],
        });

        this.player.tweens.add(AzazelTweens.IFRAME, {
            startDelay: 0,
            duration: 150,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: .2,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                }
            ]
        });

        this.player.addPhysics(new AABB(this.player.position.clone(), playerHitbox));
        this.player.setGroup(COFPhysicsGroups.PLAYER);

        this.player.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, COFEvents.ENEMY_PROJECTILE_HIT_PLAYER, null);
        this.player.setTrigger(COFPhysicsGroups.ENEMY_CONTACT_DMG, COFEvents.PHYSICAL_ATTACK_HIT_PLAYER, null);
    }


    protected initializeEnemyBoss(key: string, controller: new (...a: any[]) => EnemyController,
     scaleSize: number, enemySpawn: number[]): void {
        this.enemyBoss = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.enemyBoss.scale.set(scaleSize, scaleSize);
        this.enemyBoss.position.copy(new Vec2(enemySpawn[0], enemySpawn[1]));

        // Give enemy boss its AI
        this.enemyBoss.addAI(controller, {player: this.player});

        let enemyHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        enemyHitbox.x = enemyHitbox.x - 6;

        //this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), enemyHitbox));
        this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x-15, this.enemyBoss.boundary.getHalfSize().clone().y-15)));
        this.enemyBoss.setGroup(COFPhysicsGroups.ENEMY);
        this.enemyBoss.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, null);
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
        barLabel.font = "PixelSimple";
        barLabel.textColor = color;
        
        return barLabel;
    }

}
