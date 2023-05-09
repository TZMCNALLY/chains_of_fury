import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class HorizontalCharge extends MoonDogState {

    protected _target: Vec2 = undefined;
    protected _attackChargeUpTime: number;

    private overshootFactor: number;

	public onEnter(options: Record<string, any>): void {
        this._attackChargeUpTime = .5;

        if (this.parent.health > 300) {
            this.overshootFactor = 1.5;
        } else {
            this.overshootFactor = 1.1;
        }
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        let direction: Vec2;

        let yDist = this.owner.position.y - this.parent.player.position.y;
        if ((yDist < 15 && yDist > -30) || this._target != undefined) {
            // Boss is in y-range and ready to charge.

            this.parent.speed = this.parent.chargeSpeed; // Charge speed
            
            if (this.parent.health > 500) {
                this.parent.speed *= 1.2;
            }
            
            // Calculate target location.
            if (this._target === undefined) {
                this._target = new Vec2(
                    // Calculates how far the player is, and over shoot by a bit.
                    // min max xvalues so that boss doesn't get stuck: 300, 1000
                    MathUtils.clamp(this.owner.position.x - (this.owner.position.x-this.parent.player.position.x)*this.overshootFactor, 300, 1000),
                    this.owner.position.y
                )

                // Adjust target to other side if still in phase 1
                if (this.parent.health > 500) {
                    this._target.x = (this.owner.position.x > 600 ? 400 : 800);
                }
            }
            
            // Calculate distance to target.
            let xDiff = this.owner.position.x - this._target.x;
            if (xDiff < 25 && xDiff > -25) {
                // If at target, reset target and finish this state.
                this._target = undefined;
                this.owner.setGroup(COFPhysicsGroups.ENEMY); // Disable contact damage.
                
                if (this.parent.health > 500) {
                    this.finished(MoonDogStates.IDLE);
                } else {
                    this.finished(MoonDogStates.POUND);
                }
                
                return;
            }

            // Sets movement direction
            direction = new Vec2(this.owner.position.x-this._target.x > 1 ? -1 : 1, 0);

            this.owner.animation.playIfNotAlready(MoonDogAnimation.CHARGE);
            // Flips sprite direction
            this.owner.invertX = direction.x > 0;

            // Make sure the boss is charged up first.
            if (this._attackChargeUpTime > 0) {
                this._attackChargeUpTime -= deltaT;
                // Overrides direction.
                direction = new Vec2(0, 0);
            } else {
                // Enable contact damage for boss.
                this.owner.setGroup(COFPhysicsGroups.ENEMY_CONTACT_DMG);
            }
            
        } else {
            // Boss need to reposition.

            this.parent.speed = this.parent.walkSpeed; // Reposition walk speed

            if (this.parent.health < 500) {
                this.parent.speed *= 1.2;
            }

            // x component of movement, moves faster when close, slow when far.
            let xComponent = (this.owner.position.x - this.parent.player.position.x);
            if (xComponent > 0) {
                xComponent = 1 - (xComponent/1000);
            } else {
                xComponent = -1 - (xComponent/1000);
            }

            // Sets movement direction
            direction = new Vec2(
                // x component, scales player distance, 
                xComponent,
                yDist < 0 ? 1 : -1 // Whether to go up or down.
            ); 
        }

        // Move boss with regards to direction and speed.
        this.owner.move(direction.scale(this.parent.speed).clone());
	}


	public onExit(): Record<string, any> {
		this.owner.animation.stop();

        return {};
	}
}