import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import COFAnimatedSprite from "../../../Nodes/COFAnimatedSprite";
import SnowballBehavior from "../SnowballBehavior";

export default abstract class SnowballState extends State {

    protected parent: SnowballBehavior;
	protected owner: COFAnimatedSprite;

	public constructor(parent: SnowballBehavior, owner: COFAnimatedSprite){
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
                throw new Error(`Unhandled event in IceMirrorState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {
    }

    public abstract onExit(): Record<string, any>;
}