import { MoonDogAnimation, MoonDogStates } from "../MoonDogController";
import MoonDogState from "./MoonDogState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { COFPhysicsGroups } from "../../../COFPhysicsGroups";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

export default class Magic extends MoonDogState {

    protected _target: Vec2 = undefined;
    protected _attackChargeUpTime: number;

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(MoonDogAnimation.MAGIC);
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);   
	}


	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}