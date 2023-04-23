import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import COFAnimatedSprite from "../../Nodes/COFAnimatedSprite";
import AzazelController from "../AzazelController";

/**
 * An abstract state for the PlayerController 
 */
export default abstract class PlayerState extends State {

    protected parent: AzazelController;
	protected owner: COFAnimatedSprite;

	public constructor(parent: AzazelController, owner: COFAnimatedSprite){
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
        let direction = this.parent.inputDir;
    }

    public abstract onExit(): Record<string, any>;
}