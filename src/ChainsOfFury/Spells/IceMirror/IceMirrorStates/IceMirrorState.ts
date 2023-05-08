import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import COFAnimatedSprite from "../../../Nodes/COFAnimatedSprite";
import IceMirrorBehavior from "../IceMirrorBehavior";

export default abstract class IceMirrorState extends State {

    protected parent: IceMirrorBehavior;
	protected owner: COFAnimatedSprite;

	public constructor(parent: IceMirrorBehavior, owner: COFAnimatedSprite){
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