import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { PlayerTweens } from "../PlayerController";
import PlayerState from "./PlayerState";
import { PlayerAnimations } from "../PlayerController";
import { HW3Events } from "../../HW3Events";
import Input from "../../../Wolfie2D/Input/Input";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Level1 from "../../Scenes/HW3Level1";

/**
 * The Dead state for the player's FSM AI. 
 */
export default class Dead extends PlayerState {

    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void {
        Input.disableInput();
        this.owner.animation.play(PlayerAnimations.DYING);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key:Level1.DYING_AUDIO_KEY, loop: false, holdReference: false });
        setTimeout(() => {this.owner.animation.play(PlayerAnimations.DEAD)}, 1000);
        setTimeout(() => {this.emitter.fireEvent(HW3Events.PLAYER_DEAD); Input.enableInput();}, 2000);
        //this.owner.tweens.play(PlayerTweens.DEATH);
    }

    // Ignore all events from the rest of the game
    public handleInput(event: GameEvent): void { }

    // Empty update method - if the player is dead, don't update anything
    public update(deltaT: number): void {}

    public onExit(): Record<string, any> { return {}; }
    
}