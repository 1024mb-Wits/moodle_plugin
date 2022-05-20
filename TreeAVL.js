class Tree {
    constructor(main, rootValue, draw=true) {
        this.main = main;

        // Create matrix for nodes
        this.nodes = new Array(this.main.ROWS);
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i] = new Array(this.main.COLS);
        }

        this.root = new Node(this.main, rootValue);
        this.root.parent = null;
        this.numNodes = 1;
        this.nodeArray = [];
        if(draw) {
            this.root.draw(null, (this.main.COLS - 1) * 0.5, 0); // parent, cellX, cellY
            this.nodes[this.root.cellCoords.y][this.root.cellCoords.x] = this.root;
            this.nodeArray.push(this.root);
            this.root.orderPlaced = this.numNodes;
        }

        this.string = "";
        this.childPos = "";
    }

    addChild(selectedNode, selectedChild) {
        let newChild;

        if(selectedNode.value > selectedChild.value) {
            selectedNode.children.leftChild = selectedChild;
            selectedChild.parent = selectedNode;
        }
        else if (selectedNode.value < selectedChild.value) {
            selectedNode.children.rightChild = selectedChild;
            selectedChild.parent = selectedNode;
        }

        selectedChild.draw(selectedNode, selectedChild.cellCoords.x, selectedChild.cellCoords.y);
        this.nodes[selectedChild.cellCoords.y][selectedChild.cellCoords.x] = selectedChild;

        this.nodeArray.push(selectedChild);

    }


    /** Returns the first node whose value (and potentially order) matches the argument(s) */
    getNode(value, order = null) {
        for(const node of this.nodeArray) {
            if(value && order) {
                if(node.value === value && node.orderPlaced === order) return node;
            }
            else if(value) {
                if(node.value === value) return node;
            }
            else if(order) {
                if(node.orderPlaced === order) return node;
            }
            else {
                break; // Nothing specified - return null
            }
        }

        return null;
    }

    
    removeEdge(selectedNode, selectedChild) {

        if(!selectedNode.isRoot) {
            if(selectedChild.childType() === "L") {
                selectedNode.children.leftChild = null;
            }
            else {
                selectedNode.children.rightChild = null;
            }

            selectedNode = null;
        }
    }
    //Removes edge between parent and child
    setNewRoot(rootValue, draw=true) {
        this.root = new Node(this.main, rootValue);
        this.root.parent = null;
        if(draw) {
            this.root.draw(null, (this.main.COLS - 1) * 0.5, 0); // parent, cellX, cellY
            this.nodes[this.root.cellCoords.y][this.root.cellCoords.x] = this.root;
            this.nodeArray.push(this.root);
            this.numNodes = 1;
            this.root.orderPlaced = this.numNodes;
        }
    }

    /** TESTING */
    printTree() {
        let tree = "";
        for(let i = 0; i < this.main.ROWS; i++) {
            for(let j = 0; j < this.main.COLS; j++) {
                if(typeof this.nodes[i][j] !== "undefined") {
                    tree += this.nodes[i][j].value + " ";
                } 
                else {
                    tree += "- ";  
                }
            }
            console.log(tree);
            tree = "";
        }

        console.log("\n\n\n");
    }

    remake(direction) {
        /** Create temp matrix for nodes */
        let tempMatrix = new Array(this.main.ROWS);
        for(let i = 0; i < tempMatrix.length; i++) {
            tempMatrix[i] = new Array(this.main.COLS);
        }

        let resizeFactor = direction === "grow" ? 1 : -1;
        
        /** Shift every node one unit over */
        for(let i = 0; i < tempMatrix.length - 2; i++) {
            for(let j = 0; j < tempMatrix[0].length - 2; j++) {
                if(typeof this.nodes[i][j] !== "undefined") {
                    tempMatrix[i][j+resizeFactor] = this.nodes[i][j];
                    this.nodes[i][j].cellCoords.x += resizeFactor;
                }               
            }   
        }
        this.nodes = tempMatrix;
    }

    /** Generates a string representation of the tree so that it can be reconstructed. Nodes are arranged by order placed */
    convertToString(node) {
        if(!node) return;

        if(node.isRoot) {
            this.string += this.main.ROWS + "," + this.main.COLS + ":" + node.value + ":ROOT:" + node.cellCoords.y + "," + node.cellCoords.x;
        }
        else {
            this.string += node.value + ":" + this.generateChildPosition(node) + ":" + node.cellCoords.y + "," + node.cellCoords.x;
        }

        if(this.string.split("#").length !== this.numNodes) {
            this.string += "#";
        }
        
        this.convertToString(this.getNode(null, node.orderPlaced + 1));
    }

    convertToStringForBST(nodeStack) {
        for(const node of nodeStack) {
            if(node.isRoot) {
                this.string += node.value;
            }
            else {
                this.string += node.value + "#" + this.generateChildPosition(node);
            }

            if(this.string.split(":").length !== this.numNodes) {
                this.string += ":";
            }
        }
    }

// This part has been added ***********************************************************************
    convertToStringForAVL(nodeStack) {
        for(const node of nodeStack) {
            if(node.isRoot) {
                this.string += node.value;
            }
            else {
                this.string += node.value + "#" + this.generateChildPosition(node);
            }

            if(this.string.split(":").length !== this.numNodes) {
                this.string += ":";
            }
        }
    }
//*************************************************************************************************

    generateChildPosition(node) {
        let childPos = "";

        while(node !== this.root) {
            if(node.parent === this.root) {
                childPos += node.childType();
            }
            else {
                childPos += node.childType() + ".";
            }

            node = node.parent;
        }

        childPos = childPos.split("").reverse().join(""); // Get child position from root to child instead of from child to root e.g. LLR not RLL

        if(childPos === "") childPos = "ROOT";

        return childPos;
    }

    isDuplicateValue(nodeValue) {
        for(const node of this.nodeArray) {
            if(nodeValue === node.value) return true;
        }

        return false;
    }

    allowedValueForAVL(newNodeValue, childType) {
        let attemptedPlacement = "";
        let correctPlacement = "";
        let currNode = this.root;
        
        /** The new node's position in the tree */
        if(this.main.selectedNode === this.root) {
            attemptedPlacement = childType;
        }
        else {
            attemptedPlacement = this.generateChildPosition(this.main.selectedNode) + "." + childType;
        }

        /** Where the node should be placed */
        let leftOrRight = "";
        while(currNode) {
            if(newNodeValue < currNode.value) {
                leftOrRight = "L";
                currNode = currNode.children.leftChild;
            }
            else {
                leftOrRight = "R";
                currNode = currNode.children.rightChild;
            }

            if(correctPlacement === "") correctPlacement += leftOrRight;
            else correctPlacement += "." + leftOrRight;
        }

        if(attemptedPlacement === correctPlacement) return true; // If they are equal, the BST property is maintained and so this is a valid new node

        return false;
    }
}