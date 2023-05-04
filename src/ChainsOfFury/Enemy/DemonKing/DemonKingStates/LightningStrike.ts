import { DemonKingAnimations } from "../DemonKingController";
import { DemonKingStates }from "../DemonKingController";
import DemonKingState from "./DemonKingState";
import DemonKingController from "../DemonKingController";
import RandUtils from "../../../../Wolfie2D/Utils/RandUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { DemonKingEvents } from "./DemonKingEvents";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

export default class LightningStrike extends DemonKingState {

    protected numStrikes: number; // how many strikes should happen before finishing
    protected strikeTimer: Timer; // the timer to track when to despawn the lightning strike
    protected strikeLocation: Vec2; // the location to strike lightning. The strike will be lagging behind 
                                    // the position of the player to allow them to move out the way.

	public onEnter(options: Record<string, any>): void {
        
        this.numStrikes = 0;
        this.strikeTimer = new Timer(400);
        this.strikeTimer.start();
        this.strikeLocation = new Vec2();
        this.owner.animation.playIfNotAlready(DemonKingAnimations.DANCING, true, null);
	}

	public update(deltaT: number): void {

        if(this.strikeTimer.timeLeft > 175 && this.strikeTimer.timeLeft < 185)
            this.strikeLocation.copy(this.parent.player.position);

        else if(this.strikeTimer.isStopped()){

            if(this.numStrikes == 5)
                this.finished(DemonKingStates.WALK)

            else {
                
                this.emitter.fireEvent(DemonKingEvents.STRUCK_LIGHTNING, {location: this.strikeLocation});
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