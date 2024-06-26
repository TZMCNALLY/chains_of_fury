import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
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
import AzazelController, { AzazelTweens } from '../Player/AzazelController';
import MainMenu from "./MainMenu";
import FireballBehavior from "../Fireball/FireballBehavior";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import { COFEvents } from "../COFEvents";
import EnemyController from "../Enemy/EnemyController";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { COFCheats } from "../COFCheats";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { HealMarkEvents } from "../Spells/HealMarks/HealMarkEvents";
import HealMarkBehavior from "../Spells/HealMarks/HealMarkBehavior";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AudioManager from '../../Wolfie2D/Sound/AudioManager';
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Game from "../../Wolfie2D/Loop/Game";

/**
 * A const object for the layer names
 */
export const COFLayers = {
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI",
    // The Pause layer
    PAUSE: "PAUSE"
} as const;

// The layers as a type
export type COFLayer = typeof COFLayers[keyof typeof COFLayers]

/**
 * Consts for the level entities
 */
export const COFEntities = {
    BOSS: "BOSS",
    MINION: "MINION",
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

    /** Object pool for heal marks */
    private healMarks: Array<AnimatedSprite>;

    /** The enemy boss sprite */
    protected enemyBoss: AnimatedSprite;
    protected enemyBossName: string;

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

    // Level end transition timer and graphic
    protected levelBeginTimer: Timer;
    protected levelTransitionScreen: Rect;
    protected levelBeginEndPosition: Vec2;
    protected isLevelBeginTransitioning: boolean;

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
    public static LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static LEVEL_MUSIC_PATH = ""; // up to each level to decide
    public static readonly PLAYER_DAMAGED_KEY = "PLAYER_DAMAGED_KEY";
    public static readonly PLAYER_DAMAGED_PATH = "cof_assets/sounds/Player/player_damaged.mp3";
    public static readonly PLAYER_TELEPORTED_KEY = "PLAYER_TELEPORTED_KEY";
    public static readonly PLAYER_TELEPORTED_PATH = "cof_assets/sounds/Player/player_teleported.mp3";
    public static readonly PLAYER_DASHED_KEY = "PLAYER_DASHED_KEY";
    public static readonly PLAYER_DASHED_PATH = "cof_assets/sounds/Player/player_dashed.mp3";
    public static readonly PLAYER_WHIFFED_KEY = "PLAYER_WHIFFED_KEY";
    public static readonly PLAYER_WHIFFED_PATH = "cof_assets/sounds/Player/player_whiffed.mp3";
    public static readonly PLAYER_HIT_KEY = "PLAYER_HIT_KEY";
    public static readonly PLAYER_HIT_PATH = "cof_assets/sounds/Player/player_hit.mp3";
    public static readonly PLAYER_DEFEATED_KEY = "PLAYER_DEFEATED_KEY";
    public static readonly PLAYER_DEFEATED_PATH = "cof_assets/sounds/Player/player_defeated.mp3";
    public static readonly FIREBALL_THROWN_KEY = "FIREBALL_THROWN_KEY";
    public static readonly FIREBALL_THROWN_PATH = "cof_assets/sounds/General/fireball_thrown.mp3";
    public static readonly ENEMY_HIT_KEY = "ENEMY_HIT_KEY";
    public static readonly ENEMY_HIT_PATH = "cof_assets/sounds/Enemies/enemy_hit.mp3";
    public static readonly HEAL_KEY = "HEAL_KEY";
    public static readonly HEAL_PATH = "cof_assets/sounds/General/healing.mp3";

    private paused: boolean;
    private pausedActors: Array<boolean>;
    private pauseMenuGenerated: boolean;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {

        // Allow overriding collision matrix from child
        if (options === undefined || !('physics' in options)) {
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
        } else {
            super(viewport, sceneManager, renderingManager, {...options});
        }

        
        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load the player and enemy spritesheets
        this.load.spritesheet("azazel", "cof_assets/spritesheets/Player/chain_devil.json");

        // Load the tilemap
        this.load.tilemap("level", "cof_assets/tilemaps/chainsoffurydemo2.json");
        
        this.load.spritesheet("fireball", "cof_assets/spritesheets/Projectiles/azazel_fireball.json");
        this.load.spritesheet("heal_marks", "cof_assets/spritesheets/Spells/healing.json");

        this.load.audio(COFLevel.PLAYER_DAMAGED_KEY, COFLevel.PLAYER_DAMAGED_PATH)
        this.load.audio(COFLevel.PLAYER_TELEPORTED_KEY, COFLevel.PLAYER_TELEPORTED_PATH)
        this.load.audio(COFLevel.PLAYER_DASHED_KEY, COFLevel.PLAYER_DASHED_PATH)
        this.load.audio(COFLevel.PLAYER_WHIFFED_KEY, COFLevel.PLAYER_WHIFFED_PATH)
        this.load.audio(COFLevel.PLAYER_HIT_KEY, COFLevel.PLAYER_HIT_PATH)
        this.load.audio(COFLevel.PLAYER_DEFEATED_KEY, COFLevel.PLAYER_DEFEATED_PATH)
        this.load.audio(COFLevel.FIREBALL_THROWN_KEY, COFLevel.FIREBALL_THROWN_PATH)
        this.load.audio(COFLevel.ENEMY_HIT_KEY, COFLevel.ENEMY_HIT_PATH)
        this.load.audio(COFLevel.HEAL_KEY, COFLevel.HEAL_PATH)
    }

    public update(deltaT: number): void {

        if(this.isLevelBeginTransitioning) {

            if(this.viewport.getCenter().x <= this.levelBeginEndPosition.x) {
                this.viewport.naniTF = false;
                this.viewport.setFocus(new Vec2(this.viewport.getCenter().x+3, this.viewport.getCenter().clone().y))
                this.viewport.setCenter(new Vec2(this.viewport.getCenter().x+3, this.viewport.getCenter().clone().y));
            }

            else {
                // this.viewport.naniTF = true;

                this.viewport.setFocus(new Vec2(this.viewport.getCenter().x+3, this.viewport.getCenter().clone().y))
                this.viewport.setCenter(new Vec2(this.viewport.getCenter().x+3, this.viewport.getCenter().clone().y));
                this.isLevelBeginTransitioning = false;
                this.levelTransitionScreen.tweens.play("fadeIn")
                this.levelBeginTimer.start();
            }
        }

        super.update(deltaT);
        if (Input.isJustPressed(COFCheats.ESCAPE)) {
            this.emitter.fireEvent(COFEvents.PAUSE_GAME);
        }
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the player 
        this.initializePlayer("azazel");

        this.initObjectPools();

        // Enable player movement
        Input.disableInput();

        // this.initializeEnemyBoss("moondog", MoonDogController);

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();

        this.initializeLevelEndUI();

        this.pauseMenuGenerated = false;
      
        this.initializeLevelTransitionUI();

        this.levelBeginTimer = new Timer(750, () => {
            this.levelTransitionScreen.tweens.play("fadeOut");
            this.enemyBoss.setAIActive(true, {})
            this.player.setAIActive(true, {})
            this.viewport.follow(this.player)
            this.initializePlayerUI();
            this.initializeBossUI(this.enemyBossName);
            Input.enableInput();
        });

        this.viewport.lastPositions.clear();

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.LEVEL_MUSIC_KEY, loop: true, holdReference: true});
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.ENEMY_HIT_KEY});
                this.handleBossHealthChange(event.data.get("currHealth"), event.data.get("maxHealth"));
                break;
            }
            case COFEvents.BOSS_HEALED: {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.HEAL_KEY})
                this.emitter.fireEvent(HealMarkEvents.DISPLAY_HEAL_MARKS, {location: (new Vec2()).copy(this.enemyBoss.position), scale: 2})
                this.handleBossHealthChange(event.data.get("currHealth"), event.data.get("maxHealth"));
                break;
            }
            case HealMarkEvents.DISPLAY_HEAL_MARKS: {
                this.handleDisplayHealMarks(event.data.get("location"), event.data.get("scale"));
                break;
            }
            case HealMarkEvents.REMOVE_HEAL_MARKS: {
                this.handleRemoveHealMarks(event.data.get("id"));
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
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: COFLevel.LEVEL_MUSIC_KEY});
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
            // case COFEvents.LEVEL_END: {
            //     this.sceneManager.changeToScene(MainMenu);
            //     break;
            // }
            case COFEvents.PAUSE_GAME: {
                this.handlePauseGame();
                break;
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
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.PLAYER_HIT_KEY});
            this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.enemyBoss.id, entity: COFEntities.BOSS});
        }

        else
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.PLAYER_WHIFFED_KEY});
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

        this.healMarks = new Array(2);
        for (let i = 0; i < this.healMarks.length; i++) {
            this.healMarks[i] = this.add.animatedSprite("heal_marks", COFLayers.PRIMARY);

            this.healMarks[i].visible = false;

            this.healMarks[i].position = Vec2.ZERO;
            this.healMarks[i].addAI(HealMarkBehavior);
        }
    }

    /**
    * Displays a fire projectile on the map
    * 
    * @param faceDir the direction the player is facing
    */

    protected spawnFireball(faceDir: Vec2) {
        for (let i = 0; i < this.fireballs.length; i++) {

            if (!this.fireballs[i].visible) {

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

    // should be overridden inside of respective levels
    protected handleMinionDead(id: number): void{
    }

    protected handleLevelEnd(): void {
        this.levelEndLabel.tweens.play("slideIn")
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: COFLevel.LEVEL_MUSIC_KEY});
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
	}

    protected handlePauseGame() {
        if (!this.paused) {
            this.paused = true;

            // Putting this somewhere else seems to mess up the positioning.
            this.generatePauseMenu();

            // Incredibily inefficient, but oh well.
            this.pausedActors = new Array(this.aiManager.actors.length);

            // Stop actors that need to be stopped.
            for (let i = 0; i < this.aiManager.actors.length; i++) {
                if (this.aiManager.actors[i].aiActive) {
                    this.pausedActors[i] = true;
                    this.aiManager.actors[i].setAIActive(false, {});
                } else {
                    this.pausedActors[i] = false;
                }
            }
            this.layers.get(COFLayers.PAUSE).enable();
        } else {
            this.paused = false;
            // Restart stopped actors.
            for (let i = 0; i < this.pausedActors.length; i++) {
                if (this.pausedActors[i]) {
                    this.aiManager.actors[i].setAIActive(true, {});
                }
            }

            // Toggle pause screen
            this.layers.get(COFLayers.PAUSE).disable();
        }

        
    }

    protected generatePauseMenu() {       
        if (this.pauseMenuGenerated) {
            return;
        }
        this.pauseMenuGenerated = true;
        

        let center = new Vec2();
        center.copy(this.viewport.getOrigin());
        center.x += this.viewport.getHalfSize().x;
        center.y += this.viewport.getHalfSize().y;

        center.y -= 10;

        // Pause menu background
        let pauseMenu = <Label>this.add.uiElement(
            UIElementType.LABEL, 
            COFLayers.PAUSE, 
            {
                position: center.clone(),
                text: "PAUSED"
            }
        );
        pauseMenu.size.set(300, 150);
        pauseMenu.backgroundColor = new Color(0, 0, 0, .9);
        pauseMenu.borderWidth = 5;
        pauseMenu.borderColor = Color.RED;
        pauseMenu.fontSize = 35;
        pauseMenu.textColor = Color.RED;

        center.y += 30;

        let unpauseText = <Label>this.add.uiElement(
            UIElementType.LABEL,
            COFLayers.PAUSE,
            {
                position: center,
                text: "Press [ESC] to unpause"
            }
        )
        unpauseText.size.set(300,100);
        unpauseText.size.set(300, 100);
        unpauseText.backgroundColor = new Color(0, 0, 0, 0);
        unpauseText.borderWidth = 5;
        unpauseText.borderColor = new Color(0, 0, 0, 0);
        unpauseText.fontSize = 18;
        unpauseText.textColor = Color.RED;

        this.layers.get(COFLayers.PAUSE).disable();
    }

    protected handleUnpauseGame() {
        // remove pause screen here
        this.uiLayers.delete(COFLayers.PAUSE);

        // unpauses all the active AI
        this.aiManager.actors.forEach(
            actor => actor.setAIActive(true, {})
        )
    }

    protected handleDisplayHealMarks(location: Vec2, scale: number) {
        for (let i = 0; i < this.healMarks.length; i++) {
            if (!this.healMarks[i].visible) {
                this.healMarks[i].scale.set(scale, scale);
                this.healMarks[i].position = location;
                this.healMarks[i].visible = true;
                this.healMarks[i].animation.play("HEALING");
                break;
            }
        }
    }

    protected handleRemoveHealMarks(id: number) {
        for (let i = 0; i < this.healMarks.length; i++) {
            if (this.healMarks[i].id === id) {
                this.healMarks[i].visible = false;
                this.healMarks[i].position.copy(Vec2.ZERO);
                break;
            }
        }
    }
    
   /**
	 * This method checks for a collision between an AABB and a circle.
	 * 
	 * @param aabb the AABB
	 * @param circle the Circle
	 * @return true if the AABB is colliding with the circle; false otherwise. 
	 * 
	 * @see AABB for more information about AABBs
	 * @see Circle for more information about Circles
	 * @see MathUtils for more information about MathUtil functions
	 */
	public checkAABBtoCircleCollision(aabb: AABB, circle: Circle): boolean {
		// =================================================
		let radius = circle.radius;
		let circleX = circle.center.x;
		let circleY = circle.center.y;

		let aabbWidth = aabb.topRight.x - aabb.topLeft.x;
		let aabbHeight = aabb.bottomLeft.y - aabb.topLeft.y;
		let aabbX = aabb.center.x;
		let aabbY = aabb.center.y;

		// Find the point on AABB to use to calculate distance to the center of the circle.
		let x = circleX;
		let y = circleY;

		// top left edge
		if (circleX < aabbX - aabbWidth/2)
			x = aabbX - (aabbWidth/2);
		// top right edge
		else if (circleX > aabbX + aabbWidth/2)
			x = aabbX + (aabbWidth/2);

		// bottom left edge
		if (circleY < aabbY - aabbHeight/2)
			y = aabbY - (aabbHeight/2);
		// bottom right edge
		else if (circleY > aabbY + aabbHeight/2)
			y = aabbY + (aabbHeight/2);

		let distX = circleX - x;
		let distY = circleY - y;
		let distance = Math.sqrt((distX * distX) + (distY * distY));

		if (distance <= radius) {
			return true;
		}
		
		return false;

		// =================================================
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
        // Add a layer for pause
        this.addLayer(COFLayers.PAUSE);
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
        this.walls.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_WALL, "");
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, COFEvents.ENEMY_PROJECTILE_HIT_WALL, "");
        // Allows a trigger to happen when boss charges into the wall.
        this.walls.setTrigger(COFPhysicsGroups.ENEMY_CONTACT_DMG, COFEvents.ENEMY_STUNNED, "");
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(COFEvents.PLAYER_SWING);
        this.receiver.subscribe(COFEvents.BOSS_TOOK_DAMAGE);
        this.receiver.subscribe(COFEvents.BOSS_HEALED);
        this.receiver.subscribe(HealMarkEvents.DISPLAY_HEAL_MARKS);
        this.receiver.subscribe(HealMarkEvents.REMOVE_HEAL_MARKS);
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
        this.receiver.subscribe(COFEvents.PAUSE_GAME);
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
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, COFLayers.UI, { position: new Vec2(-300, 100), text:"Opponent Vanquished!" });
        this.levelEndLabel.size.set(800, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.textColor = Color.RED;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 2000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 400,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: COFEvents.LEVEL_END
        });
    }

    protected initializeLevelTransitionUI(): void {

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, COFLayers.UI, { position: new Vec2(300, 200), size: new Vec2(1000, 1000)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });

        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
    }

    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        this.playerSpawn = new Vec2(500, 480);

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.player.scale.set(.4, .4);
        this.player.position.copy(this.playerSpawn);

        // Give the player its AI
        this.player.addAI(AzazelController);
        // Set AI to stop state at first while level begin transition is happening
        this.player.setAIActive(false, {})

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

        this.player.setTrigger(COFPhysicsGroups.ENEMY_PROJECTILE, COFEvents.ENEMY_PROJECTILE_HIT_PLAYER, "");
        this.player.setTrigger(COFPhysicsGroups.ENEMY_CONTACT_DMG, COFEvents.PHYSICAL_ATTACK_HIT_PLAYER, "");
    }


    /**
     * Method to initialize the enemy boss.
     * 
     * @param key the string containing the name of the boss
     * @param controller the AI the boss uses
     * @param scaleSize the scale factor of the boss
     * @param enemySpawn an length 2 array containing the coordinates of the spawn location of the boss
     * @param hitBoxModifierX the number to increase/decrease the x-value of the hitbox by
     * @param hitBoxModifierY the number to increase/decrease the y-value of the hitbox by
     */
    protected initializeEnemyBoss(key: string, controller: new (...a: any[]) => EnemyController,
     scaleSize: number, enemySpawn: number[], hitBoxModifierX: number, hitBoxModifierY: number): void {
        this.enemyBoss = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.enemyBoss.scale.set(scaleSize, scaleSize);
        this.enemyBoss.position.copy(new Vec2(enemySpawn[0], enemySpawn[1]));

        // Give enemy boss its AI
        this.enemyBoss.addAI(controller, {player: this.player});
        this.enemyBoss.setAIActive(false, {});

        let enemyHitbox = this.enemyBoss.boundary.getHalfSize().clone();
        enemyHitbox.x = enemyHitbox.x - 6;

        this.enemyBoss.addPhysics(new AABB(this.enemyBoss.position.clone(), 
        new Vec2(this.enemyBoss.boundary.getHalfSize().clone().x+hitBoxModifierX, this.enemyBoss.boundary.getHalfSize().clone().y+hitBoxModifierY)));
        this.enemyBoss.setGroup(COFPhysicsGroups.ENEMY);
        this.enemyBoss.setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, "");
    }

    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to follow the player");
        }
        //this.viewport.follow(this.player);

        // Tells the scene to play the level begin transition
        this.isLevelBeginTransitioning = true

        // Positions that the levelBegin transition will move to
        this.levelBeginEndPosition = new Vec2(800, 400)

        this.viewport.setCenter(new Vec2(400, 480))
        this.viewport.setFocus(this.viewport.getCenter())
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
