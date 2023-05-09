import COFLevel, { COFEntities, COFLayers } from "./COFLevel";
import COFLevel6 from "./COFLevel6";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SwordController from "../Enemy/Sword/SwordController";
import EnemyController from "../Enemy/EnemyController";
import AssistController, { AssistTweens } from "../Enemy/Sword/AssistController"
import { SwordTweens } from "../Enemy/Sword/SwordController";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import AABB from '../../Wolfie2D/DataTypes/Shapes/AABB';
import { SwordEvents } from "../Enemy/Sword/SwordEvents";
import { COFEvents } from "../COFEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import { COFPhysicsGroups } from '../COFPhysicsGroups';
import FireballBehavior from '../Fireball/FireballBehavior';
import Viewport from '../../Wolfie2D/SceneGraph/Viewport';
import SceneManager from '../../Wolfie2D/Scene/SceneManager';
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import { AssistEvents } from "../Enemy/Sword/AssistEvents";
import MainMenu from "./MainMenu";

export default class COFLevel5 extends COFLevel {

    protected swordAssist: AnimatedSprite;
    public assistExists: boolean;
    protected swordBeams: Array<AnimatedSprite>;
    protected tornado: AnimatedSprite;

    public static readonly basicAttackAudioKey = "BASIC_ATTACK_AUDIO_KEY";
    public static readonly BASIC_ATTACK_AUDIO_PATH = "cof_assets/sounds/Enemies/Sword/sword_basic_audio.mp3";
    public static readonly spinAttackAudioKey = "SPIN_ATTACK_AUDIO_KEY"
    public static readonly SPIN_ATTACK_AUDIO_PATH = "cof_assets/sounds/Enemies/Sword/sword_spin_audio.mp3";
    public static readonly FRENZY_AUDIO_KEY = "FRENZY_AUDIO_KEY"
    public static readonly FRENZY_AUDIO_PATH = "cof_assets/sounds/Enemies/Sword/frenzy.mp3";
    public static readonly BEAM_AUDIO_KEY = "BEAM_AUDIO_KEY"
    public static readonly BEAM_AUDIO_PATH = "cof_assets/sounds/Enemies/Sword/sword_beam.mp3";

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {

        super(viewport, sceneManager, renderingManager, options);

        //this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.audio(COFLevel5.basicAttackAudioKey, COFLevel5.BASIC_ATTACK_AUDIO_PATH);
        this.load.audio(COFLevel5.spinAttackAudioKey, COFLevel5.SPIN_ATTACK_AUDIO_PATH);
        this.load.audio(COFLevel5.FRENZY_AUDIO_KEY, COFLevel5.FRENZY_AUDIO_PATH);
        this.load.audio(COFLevel5.BEAM_AUDIO_KEY, COFLevel5.BEAM_AUDIO_PATH);

        this.load.spritesheet("flying_sword", "cof_assets/spritesheets/Enemies/flying_sword.json");
        this.load.spritesheet("flying_sword_assist", "cof_assets/spritesheets/Enemies/flying_sword_assist.json");
        this.load.spritesheet("sword_beam", "cof_assets/spritesheets/Projectiles/sword_beam.json")
        this.load.spritesheet("tornado", "cof_assets/spritesheets/Spells/tornado.json")
    }

    public startScene(): void {
        super.startScene();
        this.enemyBossName = "Satan's Blade"
        this.initializeEnemyBoss("flying_sword", SwordController, 1, [750, 480], -32, -16);
        this.enemyBoss.tweens.add(SwordTweens.SPIN, {
            startDelay: 0,
            duration: 100,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI * 2,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
        this.enemyBoss.tweens.add(SwordTweens.FADE_OUT, {
            startDelay: 0,
            duration: 200,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
        this.enemyBoss.tweens.add(SwordTweens.FADE_IN, {
            startDelay: 0,
            duration: 200,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
        this.enemyBoss.tweens.add(SwordTweens.TWIRL, {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI * 2,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        this.assistExists = false
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        switch (event.type) {
            case AssistEvents.BEAM_THROWN: {
                this.spawnSwordBeams();
                break;
            }
            case COFEvents.PLAYER_SWING: {
                if(this.assistExists)
                    this.handlePlayerSwingAssist(event.data.get("faceDir"));
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_PLAYER: {
                this.despawnSwordBeams(event.data.get("node"));
                break;
            }
            case COFEvents.ENEMY_PROJECTILE_HIT_WALL: {
                this.despawnSwordBeams(event.data.get("node"));
                break;
            }
            case SwordEvents.BASIC_ATTACK: {
                this.handleBasicAttack(event.data.get("lastFace"));
                break;
            }
            case SwordEvents.ASSIST_SUMMONED: {
                this.initializeAssist("flying_sword_assist", AssistController, 1, [632, 480], -32, -16)
            }
            case SwordEvents.SPIN_ATTACK: {
                this.handleSpinAttack();
                break;
            }
            case SwordEvents.SPIN_BEGAN: {
                this.spawnTornado();
                break;
            }
            case SwordEvents.SPIN_ENDED: {
                this.despawnTornado();
                break;
            }
            case AssistEvents.FIREBALL_HIT_ASSIST: {
                this.handleFireballHitAssist()
                this.despawnFireballs(event.data.get("node"))
                break;
            }
            case COFEvents.BOSS_DEFEATED: {
                this.handleLevelEnd();
                break;
            }
        }
    }

    protected initObjectPools(): void {
        super.initObjectPools();

        this.swordBeams = new Array(30)
        for (let i = 0; i < this.swordBeams.length; i++) {
			this.swordBeams[i] = this.add.animatedSprite("sword_beam", COFLayers.PRIMARY);

            // Make our fireballs inactive by default
			this.swordBeams[i].visible = false;

			// Assign them fireball ai
			this.swordBeams[i].addAI(FireballBehavior);

            this.swordBeams[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);
			this.swordBeams[i].scale.set(4, 4);
            this.swordBeams[i].tweens.add(AssistTweens.PROJECTILE, {
                startDelay: 0,
                duration: 200,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI * 2,
                        ease: EaseFunctionType.IN_OUT_QUAD
                    }
                ]
            });
	    }

        this.tornado = this.add.animatedSprite("tornado", COFLayers.PRIMARY);
        this.tornado.scale.set(6, 6)
        this.tornado.visible = false;
    }

    protected initializeAssist(key: string, controller: new (...a: any[]) => EnemyController,
     scaleSize: number, enemySpawn: number[], hitBoxModifierX: number, hitBoxModifierY: number): void {
        this.swordAssist = this.add.animatedSprite(key, COFLayers.PRIMARY);
        this.swordAssist.scale.set(scaleSize, scaleSize);
        this.swordAssist.position.copy(new Vec2(enemySpawn[0], enemySpawn[1]));

        this.swordAssist.addAI(controller, {player: this.player, enemyBossId: this.enemyBoss.id});

        let enemyHitbox = this.swordAssist.boundary.getHalfSize().clone();
        enemyHitbox.x = enemyHitbox.x - 6;

        this.swordAssist.addPhysics(new AABB(this.swordAssist.position.clone(), 
        new Vec2(this.swordAssist.boundary.getHalfSize().clone().x+hitBoxModifierX, this.swordAssist.boundary.getHalfSize().clone().y+hitBoxModifierY)));
        this.swordAssist.setGroup(COFPhysicsGroups.ENEMY);
        this.swordAssist.setTrigger(COFPhysicsGroups.FIREBALL, AssistEvents.FIREBALL_HIT_ASSIST, null);

        this.assistExists = true;
    }
    
    protected spawnTornado() {
        this.tornado.position.copy(new Vec2(this.enemyBoss.position.x, this.enemyBoss.position.y))
        this.tornado.visible = true
        this.tornado.animation.play("SPIN", true, null)
    }

    protected despawnTornado() {
        this.tornado.visible = false
        this.enemyBoss.tweens.play(SwordTweens.FADE_IN)
    }

    protected handleFireballHitAssist(): void {
        this.emitter.fireEvent(COFEvents.FIREBALL_HIT_ENEMY, {other: this.enemyBoss.id, entity: COFEntities.BOSS})
    }

    protected spawnSwordBeams() {
        for(let i = 0; i < this.swordBeams.length; i++) {

            if(!this.swordBeams[i].visible) {

                // Bring this fireball to life
                this.swordBeams[i].visible = true;

                let dirToPlayer = this.swordAssist.position.dirTo(this.player.position)

                dirToPlayer.x *= 300;
                dirToPlayer.y *= 300;

                (this.swordBeams[i]._ai as FireballBehavior).velocity = dirToPlayer

                // Set the starting position of the fireball
                this.swordBeams[i].position.copy(this.swordAssist.position);

                // Give physics to this fireball
                let swordBeamHitbox = new AABB(this.swordAssist.position.clone(), this.swordBeams[i].boundary.getHalfSize().clone());
                this.swordBeams[i].addPhysics(swordBeamHitbox);
                this.swordBeams[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);           
                this.swordBeams[i].tweens.play(AssistTweens.PROJECTILE, true)     
                break;
            }
        }
    }

    protected despawnSwordBeams(node: number) : void {
        for(let i = 0; i < this.swordBeams.length; i++) {

            if(this.swordBeams[i].id == node) {

                this.swordBeams[i].position.copy(Vec2.ZERO);
                this.swordBeams[i].visible = false;
                break;
            }
        }
    }

    protected handleBasicAttack(lastFace: number) {

        let basicAttackHitbox = new Vec2(16, 48)
        let basicAttackPosition = this.enemyBoss.position.clone();

        if(lastFace == -1)
            basicAttackPosition.x -= 25;
        else
            basicAttackPosition.x += 25;

        if (this.player.collisionShape.overlaps(new AABB(basicAttackPosition, basicAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
        }
    }

    protected handleSpinAttack() {
        let spinAttackHitbox = new Vec2(55, 48)
        spinAttackHitbox.x -= 16;
        spinAttackHitbox.y -= 16;
        let spinAttackPosition = this.enemyBoss.position.clone();

        if (this.player.collisionShape.overlaps(new AABB(spinAttackPosition, spinAttackHitbox))) {
            this.emitter.fireEvent(COFEvents.PHYSICAL_ATTACK_HIT_PLAYER);
        }
    }

    protected handlePlayerSwingAssist(faceDir: number) {

        let playerSwingHitbox = this.player.boundary.getHalfSize().clone();
        playerSwingHitbox.x = playerSwingHitbox.x-16;

        let swingPosition = this.player.position.clone();
        swingPosition.x += faceDir*14;

        if (this.swordAssist.collisionShape.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
            this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.enemyBoss.id, entity: COFEntities.BOSS});
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        super.subscribeToEvents();
        this.receiver.subscribe(SwordEvents.BASIC_ATTACK);
        this.receiver.subscribe(SwordEvents.SPIN_ATTACK);
        this.receiver.subscribe(AssistEvents.FIREBALL_HIT_ASSIST)
        this.receiver.subscribe(SwordEvents.ASSIST_SUMMONED)
        this.receiver.subscribe(AssistEvents.BEAM_THROWN)
        this.receiver.subscribe(COFEvents.BOSS_DEFEATED);
        this.receiver.subscribe(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        this.receiver.subscribe(COFEvents.ENEMY_PROJECTILE_HIT_WALL);
        this.receiver.subscribe(SwordEvents.SPIN_BEGAN);
        this.receiver.subscribe(SwordEvents.SPIN_ENDED);
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        MainMenu.boss5Defeated = true;
        this.sceneManager.changeToScene(COFLevel6)
    }
}