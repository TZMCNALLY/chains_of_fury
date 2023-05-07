import COFLevel, { COFLayers } from "./COFLevel";
import COFLevel2 from "./COFLevel2"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Input from "../../Wolfie2D/Input/Input";
import MoonDogController from "../Enemy/MoonDog/MoonDogController";
import EnemyController from "../Enemy/EnemyController";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
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

export default class COFLevel1 extends COFLevel {

    private minions: Array<AnimatedSprite>;
    private moonIndicators: Array<AnimatedSprite>;
    private moons: Array<AnimatedSprite>;

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
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Moon Dog");
        this.initializeEnemyBoss("moondog", MoonDogController, 1, [750, 600], -15, -15);

        this.initLittleOnes();
        this.initMoons();

        // Remove trigger for enemy projectiles (since they aren't really used here).
        let layerNumber = this.getPhysicsManager().getGroupNumber(COFPhysicsGroups.ENEMY_PROJECTILE);
        this.player.triggerMask &= ~layerNumber;
		let index = Math.log2(layerNumber);
		this.player.triggerEnters[index] = "";
		this.player.triggerExits[index] = "";
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        this.sceneManager.changeToScene(COFLevel2)
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();

        this.receiver.subscribe(MoonDogEvents.SUMMON);
        this.receiver.subscribe(MoonDogEvents.MAGIC);
        this.receiver.subscribe(MoonDogEvents.POUND);
        this.receiver.subscribe(MoonDogEvents.MOON_LANDED);
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
        }
    }

    private initLittleOnes() {
        this.minions = new Array(3);
        for (let i = 0; i < 3; i++) {
            this.minions[i] = this.add.animatedSprite("hellhound", COFLayers.PRIMARY);

            // Placeholder until I add AI for the little ones.
            this.minions[i].addAI(FireballBehavior);
            this.minions[i].scale = new Vec2(.4,.4);

            // Tweens for coming into and leaving life.
            this.minions[i].tweens.add("death", {
                startDelay: 0,
                duration: 500,
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
        for (let i = 0; i < 3; i++) {
            if (this.minions[i].visible) {
                continue;
            } else {
                // Sets the minion to a position on a random point on a circle around the boss.
                let aroundBoss = new Vec2(80,80);
                aroundBoss.rotateCCW(Math.PI * RandUtils.randFloat(0, 2));
                this.minions[i].position.copy(this.enemyBoss.position.clone().add(aroundBoss));
                // TODO: check bound.

                this.minions[i].visible = true;
                this.minions[i].tweens.play("summon");
            }
        }
    }

    private poundAttack(): void {

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

            console.log(this.moons[i].position);

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
}