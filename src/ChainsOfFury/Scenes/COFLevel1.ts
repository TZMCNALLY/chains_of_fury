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
import MainMenu from "./MainMenu";

export default class COFLevel1 extends COFLevel {

    private minions: Array<AnimatedSprite>;

    /**
     * @see Scene.update()
     */
    public loadScene(): void {
        // Load enemy
        super.loadScene();
        this.load.spritesheet("moondog", "cof_assets/spritesheets/Enemies/moondog.json");
        this.load.spritesheet("hellhound", "cof_assets/spritesheets/Enemies/hell_hound.json");
    }

    public startScene(): void {
        super.startScene();
        super.initializeBossUI("Moon Dog");
        this.initializeEnemyBoss("moondog", MoonDogController, 1, [750, 600], -15, -15);

        this.initLittleOnes();
    }

    protected handleLevelEnd(): void {
        super.handleLevelEnd();
        MainMenu.boss1Defeated = true;
        this.sceneManager.changeToScene(COFLevel2);
    }

    protected subscribeToEvents(): void {
        super.subscribeToEvents();

        this.receiver.subscribe(MoonDogEvents.SUMMON);
    }

    protected handleEvent(event: GameEvent): void {
        super.handleEvent(event);

        switch(event.type) {
            case MoonDogEvents.SUMMON: {
                this.summonLittleOnes();
            }
            case MoonDogEvents.POUND: {
                this.poundAttack();
            }
            case MoonDogEvents.MAGIC: {
                this.rainMoons();
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
            })

            this.minions[i].position.copy(Vec2.ZERO);
            this.minions[i].visible = false;
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

    }
}