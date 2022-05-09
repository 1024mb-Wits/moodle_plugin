class AVLAttempt{
    constructor(qa,main,answerBox)
    {
        console.log("EXECUTED!!!!!!!!");
        this.qa=qa;
        this.main=main;
        this.answerBox=answerBox;

        //Values: go to database and get avlValues, split by "," mao val to int 
        //undoButton: get undo button for avl tree from student.html
        //getIndex: fucntion to get index
        //stack: init empty stack 
        this.avl = {values: this.main.databaseMisc.avlvalues.split(",").map(value => parseInt(value)), undoButton: document.getElementById(this.main.canvas.id+":avl-undo"), getIndex: this.getAVLValueIndex.bind(this, this.main), stack: []};
        this.avl.undoButton.addEventListener("click", this.avlUndoClicked.bind(this));        
    }

    configureHTML()
    {
        //assign avlValueList in main to what is stored in database
        this.main.avlValueList.value=this.main.databaseMisc.avlvalues;

        //display avl tools for building tree 
        this.main.avlTools.style.display="flex";

        if(this.main.databaseMisc.displaytools)
        {
            this.main.modifyTreeTools.style.display="block";

        }
        this.main.answerQuestionTools.style.display = "none";

        // Set node value as the first value in the avl value list
        this.main.nodeValueInput.value = this.avl.values[0];
        this.main.nodeValueInput.disabled = true;
        this.main.nodeValueInput.style.color = "#ff0000";

         // Hide random node value option
         this.main.randNodeValueTools.style.display = "none";

         /** Configure buttons for avl */
         this.main.addRootButton.style.display = "inline-block";
         //hide node edit node value button
         this.main.editNodeValueButton.style.display = "none";
         //hide remove n ode button
         this.main.removeNodeButton.style.display = "none";
 
         /** Configure help text */
         this.main.tooltipText.innerHTML = this.main.helpText.avl;
    }

    getAVLValueIndex(main, direction) {
        if(direction === "next" || direction === "prev") {
            let currIndex = this.avl.values.findIndex((currValue) => currValue === Number(main.nodeValueInput.value));
            if(currIndex === -1) return;

            let factor = direction === "next" ? 1 : -1;
            currIndex += factor;

            return currIndex;
        }
    }

        avlUndoClicked() {
            let newNodeIndex = this.avl.getIndex("prev");
            
            if(typeof newNodeIndex === "undefined") {
                this.main.nodeValueInput.value = this.avl.values[this.avl.values.length - 1];
            }
            else {
                this.main.nodeValueInput.value = this.avl.values[newNodeIndex];
    
                if(newNodeIndex === 0) {
                    this.main.addRootButton.style.display = "inline-block";
                    this.avl.undoButton.style.display = "none";
                }
            }
            
            if(this.main.selectedNode === this.avl.stack[this.avl.stack.length - 1]) this.main.selectedNode = null;
            this.main.tree.removeNodeAndChildren(this.avl.stack.pop());
            this.main.redrawCanvas();
    
            while(this.main.board.canShrink()) {
                this.main.resizeBoard("shrink");
            }
            
            this.qa.handleEvent(this.main.events.UNDO);
        }
    
        treeToString() {
            this.answerBox.value = "";
    
            this.main.tree.convertToStringForAVL(this.avl.stack);
            this.answerBox.value = this.main.tree.string;
            this.main.tree.string = "";
    
            this.main.tree.convertToString(this.main.tree.root);
            this.answerBox.value += "/" + this.main.tree.string;
            this.main.tree.string = "";
    
            if(this.answerBox.value === "/") this.answerBox.value = "";
        }
    
        /** Rebuilds the BST that the student had created but not yet submitted */
        reconstructLastAnswer() {
            let treeString = this.main.databaseMisc.lastanswer.split("/"); // treeString[0] is string used for BST marking, treeString[1] is string used to reconstruct actual tree on the canvas
            this.main.buildTreeFromString(treeString[1]);
            this.answerBox.value = this.main.databaseMisc.lastanswer;
    
            let avl = treeString[0];
            let nodes = avl.split(":");
    
            let currNode;
    
            for(let i = 0; i < nodes.length; i++) {
                currNode = this.main.tree.getNode(Number(nodes[i].split("#")[0])); // Can get node by just value since all values in BST are unique
                this.avl.stack.push(currNode);
            }
    
            this.main.nodeValueInput.value = this.avl.values[this.avl.stack.length]; // Would be undefined if all the nodes from the BST value list had been added before (this.bst.stack.length === this.bst.values.length) and so nodeValueInput would be blank, otherwise will be the next value in BST value list that student hadn't added before
            this.main.addRootButton.style.display = "none"; // reconstructBSTAnwer is only called if there was at least one node placed by the student i.e. we already have a root
            this.avl.undoButton.style.display = "inline-block";
        }

}

