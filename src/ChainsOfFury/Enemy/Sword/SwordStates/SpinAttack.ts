import Timer from "../../../../Wolfie2D/Timing/Timer";
import SwordState from "./SwordState";
import { SwordStates, SwordTweens } from '../SwordController';
import Vec2 from '../../../../Wolfie2D/DataTypes/Vec2';

export default class SpinAttack extends SwordState {

    protected timer: Timer; // tracks how long the sword has been spinning for
    protected isCentered: boolean // tracks if the sword is slowing down or not

    public onEnter(options: Record<string, any>): void {
        this.isCentered = false;
        this.owner.tweens.play(SwordTweens.SPIN, true)
    }

    public update(deltaT: number): void{

        if(this.isCentered == false) {

                console.log(this.owner.position)
                //Spin toward the position of the player
                this.parent.velocity = this.owner.position.dirTo(new Vec2(600, 400))
                this.parent.velocity.x *= 800;
                this.parent.velocity.y *= 800;
                this.owner.move(this.parent.velocity.scaled(deltaT));
        }

        else{
            this.isCentered = true;
            console.log("lol")
            this.parent.player._velocity = this.parent.player.position.dirTo(this.owner.position)
            this.parent.player._velocity.scale(.5)
            this.parent.player.move(this.parent.player._velocity.scaled(deltaT))
        }
    }

    public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}