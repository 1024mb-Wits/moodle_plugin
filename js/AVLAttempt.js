class AVLAttempt {
    constructor(qa, mainAVL, answerBox) {
        this.qa = qa;
        this.mainAVL = mainAVL;
        this.answerBox = answerBox;

        this.AVL = {values: this.mainAVL.databaseMisc.AVLvalues.split(",").map(value => parseInt(value)), undoButton: document.getElementById(this.mainAVL.canvas.id+":AVL-undo"), getIndex: this.getAVLValueIndex.bind(this, this.mainAVL), stack: []};
        this.AVL.undoButton.addEventListener("click", this.AVLUndoClicked.bind(this));        
    }

    configureHTML() {
        // if(this.mainAVL.databaseMisc.treestring !== "") {
        //     this.mainAVL.buildTreeFromString(this.mainAVL.databaseMisc.treestring);
        // }

        this.mainAVL.AVLValueList.value = this.mainAVL.databaseMisc.AVLvalues; // Set the AVLValueList from the database value
        this.mainAVL.AVLTools.style.display = "flex";

        if(this.mainAVL.databaseMisc.displaytools) {
            this.mainAVL.modifyTreeTools.style.display = "block";
        }
        this.mainAVL.answerQuestionTools.style.display = "none";

        // Set node value as the first value in the AVL value list
        this.mainAVL.nodeValueInput.value = this.AVL.values[0];
        this.mainAVL.nodeValueInput.disabled = true;
        this.mainAVL.nodeValueInput.style.color = "#ff0000";

        // Hide random node value option
        this.mainAVL.randNodeValueTools.style.display = "none";

        /** Configure buttons for AVL */
        this.mainAVL.addRootButton.style.display = "inline-block";
        this.mainAVL.editNodeValueButton.style.display = "none";
        this.mainAVL.removeNodeButton.style.display = "none";

        /** Configure help text */
        this.mainAVL.tooltipText.innerHTML = this.mainAVL.helpText.AVL;
    }

    /**
     * Returns the index of the next or previous AVL value from the list
     * @param {String} direction String indicating whether we are getting the next or previous index
     */
    getAVLValueIndex(mainAVL, direction) {
        if(direction === "next" || direction === "prev") {
            // If want 0 -> if(nodeValueInput.value === "") return -1;
            let currIndex = this.AVL.values.findIndex((currValue) => currValue === Number(mainAVL.nodeValueInput.value));
            if(currIndex === -1) return;

            let factor = direction === "next" ? 1 : -1;
            currIndex += factor;

            return currIndex;
        }
    }

    AVLUndoClicked() {
        let newNodeIndex = this.AVL.getIndex("prev");
        
        if(typeof newNodeIndex === "undefined") {
            this.mainAVL.nodeValueInput.value = this.AVL.values[this.AVL.values.length - 1];
        }
        else {
            this.mainAVL.nodeValueInput.value = this.AVL.values[newNodeIndex];

            if(newNodeIndex === 0) {
                this.mainAVL.addRootButton.style.display = "inline-block";
                this.AVL.undoButton.style.display = "none";
            }
        }
        
        if(this.mainAVL.selectedNode === this.AVL.stack[this.AVL.stack.length - 1]) this.mainAVL.selectedNode = null;
        this.mainAVL.tree.removeNodeAndChildren(this.AVL.stack.pop());
        this.mainAVL.redrawCanvas();

        while(this.mainAVL.board.canShrink()) {
            this.mainAVL.resizeBoard("shrink");
        }
        
        this.qa.handleEvent(this.mainAVL.events.UNDO);
    }

    treeToString() {
        this.answerBox.value = "";

        this.mainAVL.tree.convertToStringForAVL(this.AVL.stack);
        this.answerBox.value = this.mainAVL.tree.string;
        this.mainAVL.tree.string = "";

        this.mainAVL.tree.convertToString(this.mainAVL.tree.root);
        this.answerBox.value += "/" + this.mainAVL.tree.string;
        this.mainAVL.tree.string = "";

        if(this.answerBox.value === "/") this.answerBox.value = "";
    }

    /** Rebuilds the AVL that the student had created but not yet submitted */
    reconstructLastAnswer() {
        let treeString = this.mainAVL.databaseMisc.lastanswer.split("/"); // treeString[0] is string used for AVL marking, treeString[1] is string used to reconstruct actual tree on the canvas
        this.mainAVL.buildTreeFromString(treeString[1]);
        this.answerBox.value = this.mainAVL.databaseMisc.lastanswer;

        let AVL = treeString[0];
        let nodes = AVL.split(":");

        let currNode;

        for(let i = 0; i < nodes.length; i++) {
            currNode = this.mainAVL.tree.getNode(Number(nodes[i].split("#")[0])); // Can get node by just value since all values in AVL are unique
            this.AVL.stack.push(currNode);
        }

        this.mainAVL.nodeValueInput.value = this.AVL.values[this.AVL.stack.length]; // Would be undefined if all the nodes from the AVL value list had been added before (this.AVL.stack.length === this.AVL.values.length) and so nodeValueInput would be blank, otherwise will be the next value in AVL value list that student hadn't added before
        this.mainAVL.addRootButton.style.display = "none"; // reconstructAVLAnwer is only called if there was at least one node placed by the student i.e. we already have a root
        this.AVL.undoButton.style.display = "inline-block";
    }
}