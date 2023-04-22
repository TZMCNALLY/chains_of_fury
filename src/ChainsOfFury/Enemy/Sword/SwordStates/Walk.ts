import { SwordAnimation } from "../SwordController";
import { SwordStates }from "../SwordController";
import SwordState from "./SwordState";
import SwordController from "../SwordController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import GameEvent from '../../../../Wolfie2D/Events/GameEvent';
import { COFEvents } from "../../../COFEvents";
import Receiver from '../../../../Wolfie2D/Events/Receiver';

export default class Walk extends SwordState {

	public onEnter(options: Record<string, any>): void {

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(SwordAnimation.MOVE_RIGHT)

        else
            this.owner.animation.playIfNotAlready(SwordAnimation.MOVE_LEFT)
	}

	public update(deltaT: number): void {
        super.update(deltaT);

        // Start attacking once time for walking is up
        if(this.parent.walkTimer.isStopped()) {

            console.log(this.parent.walkTimer)

            let nextAttack = RandUtils.randInt(0,1);

            if(nextAttack == 0) {
                this.finished(SwordStates.BASIC_ATTACK)
            }

            else if(nextAttack == 1) {
                this.finished(SwordStates.SPIN_ATTACK)
            }
        }

        // Walk to where the player is
        this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
        this.parent.velocity.x *= 20;
        this.parent.velocity.y *= 20;


        // Adjust animation to which way its walking towards the player
        if(this.owner.position.x < this.parent.player.position.x) {
            this.owner.animation.playIfNotAlready(SwordAnimation.MOVE_RIGHT)
            this.parent.lastFace = 1
        }

        else {
            this.owner.animation.playIfNotAlready(SwordAnimation.MOVE_LEFT)
            this.parent.lastFace = -1
        }

        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public handleInput(event: GameEvent): void {
        switch(event.type) {

            case COFEvents.SWING_HIT: {
                this.finished(SwordStates.DAMAGED)
                break;
            }

            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
	}

	public onExit(): Record<string, any> {
        console.log(this.parent.walkTimer)
		this.owner.animation.stop();
		return {};
	}
}