import COFLevel, { COFEntities, COFLayers } from "./COFLevel";
import COFLevel2 from "./COFLevel2"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import { MoonDogEvents } from "../Enemy/MoonDog/MoonDogEvents";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import FireballBehavior from "../Fireball/FireballBehavior";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Timer from "../../Wolfie2D/Timing/Timer";
import { COFPhysicsGroups } from "../COFPhysicsGroups";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import MoonBehavior from "../Enemy/MoonDog/AttackBehavior/MoonBehavior";
import { COFEvents } from "../COFEvents";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import SmallDogBehavior from "../Enemy/MoonDog/AttackBehavior/SmallDogBehavior";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class COFLevel1 extends COFLevel {

    private minions: Array<AnimatedSprite>;
    private moonIndicators: Array<AnimatedSprite>;
    private moons: Array<AnimatedSprite>;

    private groundCracks: AnimatedSprite;

    /** Overrides collision matrix so enemy projectiles can pass through */
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
            [0,0,0,1,0,1,0],
            [0,0,0,1,1,1,0],
            [0,0,0,1,1,1,0],
            [1,1,1,0,0,1,0],
            [0,1,1,0,0,0,0],
            [1,1,1,1,0,0,0],
            [0,0,0,0,0,0,0]
        ];


        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames, collisions
        }});
    }

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("moondog", "cof_assets/spritesheets/Enemies/moondog.json");
        this.load.spritesheet("hellhound", "cof_assets/spritesheets/Enemies/hell_hound.json");
        this.load.spritesheet("moon", "cof_assets/spritesheets/Spells/moon.json");
        this.load.spritesheet("moon_indicator", "cof_assets/spritesheets/Spells/moon_indicator.json");
        this.load.spritesheet("ground_crack", "cof_assets/spritesheets/Spells/ground_crack.json");
    }

    public startScene(): void {
        super.startScene();
        this.enemyBossName = "Moon Dog"
        this.initializeEnemyBoss("moondog", MoonDogController, 1, [750, 480], -15, -15);

        // Adding tween here b/c I don't want to override the initializeboss method
        this.enemyBoss.tweens.add("invul", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: .3,
                    ease: EaseFunctionType.OUT_IN_QUAD
                }
            ]
        });

        this.initLittleOnes();
        this.initMoons();

        // Just init this here b/c it is only 1 sprite.
        this.groundCracks = this.add.animatedSprite("ground_crack", COFLayers.PRIMARY);
        this.groundCracks.visible = false;
        this.groundCracks.scale = new Vec2(8,8);
        this.groundCracks.position.copy(Vec2.ZERO);

        // Remove trigger for enemy projectiles (since they aren't really used here).
        let layerNumber = this.getPhysicsManager().getGroupNumber(COFPhysicsGroups.ENEMY_PROJECTILE);
        this.player.triggerMask &= ~layerNumber;
		let index = Math.log2(layerNumber);
		this.player.triggerEnters[index] = "";
		this.player.triggerExits[index] = "";
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();

        this.receiver.subscribe(MoonDogEvents.SUMMON);
        this.receiver.subscribe(MoonDogEvents.MAGIC);
        this.receiver.subscribe(MoonDogEvents.POUND);
        this.receiver.subscribe(MoonDogEvents.MOON_LANDED);
        this.receiver.subscribe(MoonDogEvents.MINION_DEATH);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);

        switch(event.type) {
            case MoonDogEvents.SUMMON: {
                this.summonLittleOnes();
                break;
            }
            case MoonDogEvents.POUND: {
                this.poundAttack();
                break;
            }
            case MoonDogEvents.MAGIC: {
                this.rainMoons();
                break;
            }
            case MoonDogEvents.MOON_LANDED: {
                this.handleMoonLanded(event.data.get("index"));
                break;
            }
            case MoonDogEvents.MINION_DEATH: {
                this.handleLittleOnePassAway(event.data.get("node"));
                break;
            }
            case COFEvents.LEVEL_END: {
                MainMenu.boss1Defeated = true;
                this.sceneManager.changeToScene(COFLevel2);
                break;
            }
        }
    }

    private initLittleOnes() {
        this.minions = new Array(5);
        for (let i = 0; i < 5; i++) {
            this.minions[i] = this.add.animatedSprite("hellhound", COFLayers.PRIMARY);

            let p = this.add.graphic(GraphicType.POINT, COFLayers.PRIMARY, {position: Vec2.ZERO});

            this.minions[i].addAI(SmallDogBehavior, {player: this.player, debug_point: p});
            this.minions[i].scale = new Vec2(.5,.5); // Lower values cause wall collisions to break.
            this.minions[i].addPhysics(this.minions[i].boundary);
            this.minions[i].setGroup(COFPhysicsGroups.ENEMY);
            this.minions[i].setTrigger(COFPhysicsGroups.FIREBALL, COFEvents.FIREBALL_HIT_ENEMY, "");


            // Tweens for coming into and leaving life.
            this.minions[i].tweens.add("death", {
                startDelay: 0,
                duration: 360,
                effects: [
                    {
                        property: TweenableProperties.alpha,
                        start: 1,
                        end: 0,
                        ease: EaseFunctionType.OUT_IN_QUAD
                    }
                ],
                onEnd: MoonDogEvents.MINION_DEATH
            });
            this.minions[i].tweens.add("summon", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: TweenableProperties.alpha,
                        start: 0,
                        end: 1,
                        ease: EaseFunctionType.OUT_IN_QUAD
                    }
                ]
            });

            this.minions[i].position.copy(Vec2.ZERO);
            this.minions[i].visible = false;
        }
    }

    private initMoons(): void {
        this.moons = new Array(8);
        this.moonIndicators = new Array(8);

        for (let i = 0; i < 8; i++) {
            this.moons[i] = this.add.animatedSprite("moon", COFLayers.PRIMARY);
            this.moonIndicators[i] = this.add.animatedSprite("moon_indicator", COFLayers.PRIMARY);

            this.moonIndicators[i].tweens.add("appear", {
                startDelay: 0,
                duration: 1000,
                effects: [
                    {
                        property: TweenableProperties.alpha,
                        start: 0,
                        end: 1,
                        ease: EaseFunctionType.OUT_IN_QUAD
                    }
                ]
            });
            this.moons[i].tweens.add("rotate", {
                startDelay: 0,
                duration: 3000,
                effects: [
                    {
                        property: TweenableProperties.rotation,
                        start: 0,
                        end: Math.PI*2,
                        ease: EaseFunctionType.IN_OUT_QUAD
                    }
                ]
            });

            this.moonIndicators[i].scale = new Vec2(3,3);
            this.moons[i].scale = new Vec2(3,3);

            this.moons[i].addAI(MoonBehavior, {indicatorPos: this.moonIndicators[i].position, index: i});
            this.moons[i].addPhysics(null, Vec2.ZERO, false); // No need for collision shape since that is done through AABB checking w/ indicators.
            this.moons[i].setGroup(COFPhysicsGroups.ENEMY_PROJECTILE);

            // So things can pass through.
            this.moonIndicators[i].setGroup(COFPhysicsGroups.ENEMY);

            this.moonIndicators[i].visible = false;
            this.moonIndicators[i].position.copy(Vec2.ZERO);

            this.moons[i].visible = false;
            this.moons[i].position.copy(Vec2.ZERO);
        }
    }

    private summonLittleOnes(): void {
        for (let i = 0; i < 5; i++) {
            // Checks if max amount of minions is reached.
            if ((this.enemyBoss._ai as MoonDogController).minionCount >= 3 && 
            (this.enemyBoss._ai as MoonDogController).health > 300) {
                return;
            }


            if (this.minions[i].visible) {
                // nvm just do nothing.
                continue;
            } else {
                // Sets the minion to a position on a random point on a circle around the boss.
                let aroundBoss = new Vec2(80,80);
                aroundBoss.rotateCCW(Math.PI * RandUtils.randFloat(0, 2));

                // check bound. (flip direction of the around boss if out of bounce.)
                if (this.enemyBoss.position.clone().add(aroundBoss).y > 780 || 
                    this.enemyBoss.position.clone().add(aroundBoss).y < 180) {
                        aroundBoss.y *= -1;
                }
                if (this.enemyBoss.position.clone().add(aroundBoss).x > 1040 || 
                    this.enemyBoss.position.clone().add(aroundBoss).x < 240) {
                        aroundBoss.x *= -1;
                }

                this.minions[i].position.copy(this.enemyBoss.position.clone().add(aroundBoss));

                this.minions[i].visible = true;
                this.minions[i].tweens.play("summon");
                (this.minions[i]._ai as SmallDogBehavior).reset();

                (this.enemyBoss._ai as MoonDogController).minionCount += 1;
            }
        }
    }

    private poundAttack(): void {
        this.groundCracks.position.copy(this.enemyBoss.position);
        this.groundCracks.position.y += 30;
        this.groundCracks.visible = true;
        let groundCrackTimer = new Timer(200, () => {
            this.groundCracks.visible = false;
            this.groundCracks.position.copy(Vec2.ZERO);
        })
        groundCrackTimer.start();

        if (this.groundCracks.boundary.overlaps(this.player.collisionShape)) {
            this.emitter.fireEvent(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        }
    }

    private rainMoons(): void {
        // Summon 8 moons to drop on the player
        let offset = 0;
        for (let i = 0; i < 8; i++) {
            let moonTimer = new Timer(RandUtils.randInt(offset+800, offset+1250), () => {
                this.individualMoon();
            });
            moonTimer.start();
            offset += 1250;
        }
    }

    private individualMoon(): void {
        for (let i = 0; i < 8; i++) {
            if (this.moonIndicators[i].visible) {
                continue;
            }

            // A random spot around the player.
            this.moonIndicators[i].position.copy(
                this.player.position.clone().add(
                    (new Vec2(RandUtils.randInt(10, 50),RandUtils.randInt(10, 50))).rotateCCW(RandUtils.randFloat(0,2) * Math.PI)
                ) 
            );

            this.moonIndicators[i].tweens.play("appear", false);
            this.moonIndicators[i].visible = true;
            this.moonIndicators[i].animation.play("STATIC", true);

            // Since each indicator is directly tied to its own moon, there shouldn't be a need for a check.
            this.moons[i].position.copy(
                // Position to be to the top right offscreen.
                this.moonIndicators[i].position.clone().add(new Vec2(200,-800))
            );
            (this.moons[i]._ai as FireballBehavior).velocity = new Vec2(-100,400);

            this.moons[i].visible = true;
            this.moons[i].animation.play("STATIC", true);
            this.moons[i].tweens.play("rotate");

            return;
        }
    }

    private handleMoonLanded(index: number): void {
        // Get rid of moon projectile.
        this.moons[index].visible = false;
        this.moons[index].position.copy(Vec2.ZERO);

        this.moonIndicators[index].animation.play("EXPLODE");

        // The original hitbox moved downwards by half.
        let hitbox2 = this.moonIndicators[index].boundary.clone();
        hitbox2.center.y += hitbox2.halfSize.y;

        // Check if player in range of both original and moved hitbox.
        // This will return true if the player is the in bottom half of the boundary.
        if (this.moonIndicators[index].boundary.overlaps(this.player.collisionShape) && hitbox2.overlaps(this.player.collisionShape)) {
            this.emitter.fireEvent(COFEvents.ENEMY_PROJECTILE_HIT_PLAYER);
        }

        // Removes the indicator after the animation palys
        let removeIndicatorTimer = new Timer(80, () => {
            this.moonIndicators[index].visible = false;
            this.moonIndicators[index].position.copy(Vec2.ZERO);
        });
        removeIndicatorTimer.start();
    }

    // Override to add support for minions.
    protected handlePlayerSwing(faceDir: number) {
        let playerSwingHitbox = this.player.boundary.getHalfSize().clone();
        playerSwingHitbox.x = playerSwingHitbox.x-16;

        let swingPosition = this.player.position.clone();
        swingPosition.x += faceDir*14;

        let enemyHit = false;

        // This should loop through all hitable object? and fire event.
        if (this.enemyBoss.collisionShape.overlaps(new AABB(swingPosition, playerSwingHitbox))) {
            enemyHit = true
            this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.enemyBoss.id, entity: COFEntities.BOSS});
        }

        for (let i = 0; i < 5; i++) {
            if (this.minions[i].boundary.overlaps(new AABB(swingPosition, playerSwingHitbox)) && this.minions[i].visible) {
                enemyHit = true;
                this.emitter.fireEvent(COFEvents.SWING_HIT, {id: this.minions[i].id, entity: COFEntities.MINION});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.ENEMY_HIT_KEY});
            }
        }

        if (enemyHit == false) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: COFLevel.PLAYER_WHIFFED_KEY});
        }
    }

    private handleLittleOnePassAway(id: number): void {
        for (let i = 0; i < 5; i++) {
            if (this.minions[i].id == id) {
                this.minions[i].visible = false;
                this.minions[i].animation.stop();
                this.minions[i].position.copy(Vec2.ZERO);
                (this.enemyBoss._ai as MoonDogController).minionCount -= 1;
                return;
            }
        }
    }
}