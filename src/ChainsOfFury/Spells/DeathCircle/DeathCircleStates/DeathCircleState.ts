import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import COFAnimatedSprite from "../../../Nodes/COFAnimatedSprite";
import DeathCircleBehavior from "../DeathCircleBehavior";

export default abstract class DeathCircleState extends State {

    protected parent: DeathCircleBehavior;
	protected owner: COFAnimatedSprite;

	public constructor(parent: DeathCircleBehavior, owner: COFAnimatedSprite){
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
                throw new Error(`Unhandled event in DeathCircleState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {
    }

    public abstract onExit(): Record<string, any>;
}