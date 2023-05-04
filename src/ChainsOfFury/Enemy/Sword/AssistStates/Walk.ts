import { AssistAnimations } from "../AssistController";
import { AssistStates }from "../AssistController";
import AssistState from "./AssistState";
import AssistController from "../AssistController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import GameEvent from '../../../../Wolfie2D/Events/GameEvent';
import { COFEvents } from "../../../COFEvents";
import Receiver from '../../../../Wolfie2D/Events/Receiver';
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class Walk extends AssistState {

	public onEnter(options: Record<string, any>): void {

        this.parent.walkTime = new Date();

        if(this.parent.lastFace == -1)
            this.owner.animation.playIfNotAlready(AssistAnimations.MOVE_RIGHT)

        else
            this.owner.animation.playIfNotAlready(AssistAnimations.MOVE_LEFT)
	}

	public update(deltaT: number): void {
        super.update(deltaT);

        this.checkToFinish();

        // Walk to where the player is
        this.parent.velocity = this.owner.position.dirTo(this.parent.player.position)
        this.parent.velocity.x *= 20;
        this.parent.velocity.y *= 20;

        // Adjust animation to which way its walking towards the player
        if(this.owner.position.x < this.parent.player.position.x) {
            this.owner.animation.playIfNotAlready(AssistAnimations.MOVE_RIGHT)
            this.parent.lastFace = 1
        }

        else {
            this.owner.animation.playIfNotAlready(AssistAnimations.MOVE_LEFT)
            this.parent.lastFace = -1
        }

        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}

    // Checks if the Assist is done walking and should do different action
    private checkToFinish() {
        const currentTime = new Date();
        if(currentTime.getTime() - this.parent.walkTime.getTime() > 2000){

            if(this.parent.getDistanceFromPlayer() > 200)
                this.finished(AssistStates.HEAL);

            // ADD OPTION TO SWAP PLACES LATER
			else {
                this.finished(AssistStates.THROW_BEAM);
            }
        }
    }
}