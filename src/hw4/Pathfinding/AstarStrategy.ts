import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

class Node {
    position: Vec2;
    hCost: number = 0;
    gCost: number = 0;
    parent : Node;

    constructor(position: Vec2) {
        this.position = position;
    }

    fCost() {
        return this.hCost + this.gCost;
    }
}

function distance(to: Node, from: Node): number {
    let distanceX = Math.abs(from.position.x - to.position.x);
    let distanceY = Math.abs(from.position.y - to.position.y);

    let difference = Math.abs(distanceX - distanceY);
    if (distanceX > distanceY) {
        return 10*(difference) + 14*distanceX;
    }
    return 10*(difference) + 14*distanceY;
}
// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        let graph = this._mesh.graph;

        let open: Node[] = [];
        let closed: Node[] = [];
        let stack = new Stack<Vec2>(10000);

        let indexOfFromNode = graph.snap(from);
        let fromNode = graph.getNodePosition(indexOfFromNode);
        open.push(new Node(fromNode));

        let indexOfToNode = graph.snap(to);
        let toNode = graph.getNodePosition(indexOfToNode);
        stack.push(to);
        stack.push(graph.getNodePosition(indexOfToNode));
        
        while (open.length > 0) {
            let current : Node = open[0];
            for (let i = 1; i < open.length; i++) {
                if (open[i].fCost < current.fCost || (open[i].fCost == current.fCost && open[i].hCost < current.hCost)) {
                    current = open[i];
                }
            }

            const index = open.indexOf(current);
            open.splice(index,1);
            closed.push(current);

            if (current.position == toNode) {
                while (current != null) {
                    stack.push(current.position);
                    current = current.parent;
                }
                stack.push(graph.getNodePosition(graph.snap(from)));
                return new NavigationPath(stack);
            }

            let currentPos = graph.snap(current.position);
            let edge = graph.getEdges(currentPos);
            // if (graph.getDegree(currentPos) == null) {
            //     continue;
            // }
            while (edge != null) {
                let childVec = graph.getNodePosition(edge.y);
                let child = new Node(childVec);

                let inClosed = false;
                for (let i = 0; i < closed.length; i++) {
                    if (closed[i].position == child.position) {
                        inClosed = true;
                    }
                }
                if (inClosed) {
                    edge = edge.next;
                    continue;
                }

                let costToNext = current.gCost + distance(current, child);
                let inOpen = false;
                let index = 0;
                for (let i = 0; i < open.length; i++) {
                    if (childVec == open[i].position) {
                        index = i;
                        inOpen = true;
                        break;
                    }
                }
                if (inOpen && costToNext < open[index].gCost) {
                    open[index].gCost = costToNext;
                    open[index].hCost = distance(child, new Node(toNode));
                    open[index].parent = current;
                }

                if (!inOpen) {
                    child.gCost = costToNext;
                    child.hCost = distance(child, new Node(toNode));
                    child.parent = current;
                    open.push(child);
                }

                edge = edge.next;
            }
        }

        return new NavigationPath(new Stack());
    }
    
}