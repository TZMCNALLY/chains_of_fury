import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DemonKingEvents } from "./DemonKingEvents";

export default class LightningStrike extends DemonKingState {

    protected numStrikes: number; // how many strikes should happen before finishing
    protected strikeTimer: Timer; // the timer to track when to despawn the lightning strike

	public onEnter(options: Record<string, any>): void {
        
        this.numStrikes = 0;
        this.strikeTimer = new Timer(1000);
        this.owner.animation.playIfNotAlready(DemonKingAnimations.DANCING, true, null);
	}

	public update(deltaT: number): void {

        if(this.strikeTimer.isStopped()){

            if(this.numStrikes == 3)
                this.finished(DemonKingStates.WALK)

            else {
                
                this.emitter.fireEvent(DemonKingEvents.STRUCK_LIGHTNING);
                this.strikeTimer.reset(); 
                this.strikeTimer.start();
                this.numStrikes++;
            }
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}