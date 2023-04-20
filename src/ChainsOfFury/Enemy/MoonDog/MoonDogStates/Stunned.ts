import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";

export default class Stunned extends MoonDogState {

    protected stunTime: number;

	public onEnter(options: Record<string, any>): void {
        console.log("Entered stunned state");

        this.owner.animation.play(MoonDogAnimation.TAKINGDAMAGE_LEFT);

        // Knockback ennemy.
        this.parent.velocity.scaleTo(-10);

        this.stunTime = 1.5; // How long this enemy will be stunned for.
	}

	public update(deltaT: number): void {
		super.update(deltaT);

        // After knockback
        if (this.parent.velocity.x == 0 && this.parent.velocity.y == 0) {

            // Finish state when timer run out.
            if (this.stunTime < deltaT) {
                this.finished(MoonDogStates.IDLE);
            } else {
                this.stunTime -= deltaT;
            }
            return;
        }

        // Move to knockback.
        this.owner.move(this.parent.velocity);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
        this.parent.stunned = false;
		return {};
	}
}