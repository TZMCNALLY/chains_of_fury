import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import COFAnimatedSprite from "../../../Nodes/COFAnimatedSprite";
import SwordController from "../SwordController";

/**
 * An abstract state for the PlayerController 
 */
export default abstract class SwordState extends State {

    protected parent: SwordController;
	protected owner: COFAnimatedSprite;

	public constructor(parent: SwordController, owner: COFAnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {
        // This updates the direction the player sprite is facing (left or right)
        // let direction = this.parent.inputDir;

        //This was the snippet of code that flipped the sprite in HW3. I don't understand why it does but now you know
		// if(direction.x !== 0){
		// 	this.owner.invertX = MathUtils.sign(direction.x) < 0;
		// }
    }

    public abstract onExit(): Record<string, any>;
}