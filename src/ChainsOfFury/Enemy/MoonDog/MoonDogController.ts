import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import EnemyController from "../EnemyController";
import Idle from "./states/Idle";



export const MoonDogState = {
    IDLE: "IDLE",
    RUN: "RUN",
	DAMAGED: "DAMAGED",
    SWING: "SWING",
    HURL: "HURL",
    DEAD: "DEAD",
    GUARD: "GUARD"
} as const


export const MoonDogAnimation = {
    IDLE: "IDLE",
    ATTACK_RIGHT: "ATTACK_RIGHT",
    ATTACK_LEFT: "ATTACK_LEFT",
    TAKINGDAMAGE_RIGHT: "TAKINGDAMAGE_RIGHT",
    TAKINGDAMAGE_LEFT: "TAKINGDAMAGE_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    RUN_LEFT: "RUN_LEFT",
    DYING_RIGHT: "DYING_RIGHT",
    DYING_LEFT: "DYING_LEFT",
    DEAD_RIGHT: "DEAD_RIGHT",
    DEAD_LEFT: "DEAD_LEFT",
    CHARGE_RIGHT: "CHARGE_RIGHT",
    CHARGE_LEFT: "CHARGE_LEFT",
} as const


export default class MoonDogController extends EnemyController {

    public initializeAI(owner: COFAnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);

        this.addState(MoonDogState.IDLE, new Idle(this, this.owner));

        this.initialize(MoonDogState.IDLE);
    }    

}