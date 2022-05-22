class AVLQuestion {
    constructor(main) {
        this.main = main;

        this.radio = document.querySelector('[qtype_name="avl"]');
        this.nodeAmountInputAVL = document.getElementById("id_node_amount_avl");

        this.nodeAmountAVL = 0;
        this.randomAVLValues = [];

        //get refrence to hidden element in qtype header
        //avl values will hold the values to be displayed
        this.avlValues=document.getElementById("avlvalues");
        //avl string holds the correct AVL tree string for marking
        this.avlString=document.getElementById("avl_string");

        //if radio is clicked, change question type to what has been clicked
        this.radio.addEventListener("change", this.updateQuestionType.bind(this));
        //random val clicked, change event...((action,fucntion)
        this.nodeAmountInputAVL.addEventListener("input", this.generateRandomAVLValues.bind(this));
    }

    //Called when 'Construct AVL' radio button is clicked 
    updateQuestionType() {
        //go to QSetup.js
        //in QSetup.js call the updatecurrentq and pass BST as the type of question
        this.main.setup.updateCurrentQuestion("AVL");

        this.updateRandomAVLValues();
    }

    generateRandomAVLValues() {
        this.main.avlValueList.value = "";
        this.avlValues.value = "";
        // Reset the list of previous AVL values
        this.randomAVLValues.length = 0; 
        this.nodeAmountAVL = Number(this.nodeAmountInputAVL.value);

        if(this.nodeAmountAVL > (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE)) return; // If number of requested nodes is greater than possible unique values
        if(this.nodeAmountAVL > this.main.ROWS * this.main.COLS) return;

        for(let i = 0; i < this.nodeAmountAVL; i++) {
            let newValue = Math.floor(Math.random() * (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE) + this.main.MIN_NODE_VALUE);

            while(this.randomAVLValues.includes(newValue)) { // No duplicate values in BST
                newValue = Math.floor(Math.random() * (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE) + this.main.MIN_NODE_VALUE);
            }

            this.randomAVLValues.push(newValue);
            this.main.avlValueList.value += newValue;
            this.avlValues.value += newValue;
            
            if(i !== this.nodeAmountAVL - 1) {
                this.main.avlValueList.value += ", ";
                this.avlValues.value += ", ";
            }
        }

        this.createAVLFromValues();
    }

    
    createAVLFromValues() {
        if(this.main.avlValueList.value === "") {
            this.avlString.value = "";
            return;
        }

        let array = this.main.avlValueList.value.split(",").map(value => parseInt(value));
        let avlStack = []; // Needed to construct BST answer string

        let rootValue = array[0];
        if(this.main.tree) {
            this.main.tree = null;
        }
        this.main.tree = new Tree(this.main, rootValue, false);
        avlStack.push(this.main.tree.root);

        let newNode;

        for(let i = 1; i < array.length; i++) {
            let parent = this.main.tree.root;
            let currNode = parent;
            let childType = "";

            while(currNode !== null) {
                parent = currNode;

                if(array[i] < parent.value) {
                    currNode = currNode.children.leftChild;
                    childType = "L";
                }
                else {
                    currNode = currNode.children.rightChild;
                    childType = "R";
                }
            }

            newNode = this.main.tree.addChildNoDraw(parent, childType, array[i]);
            avlStack.push(newNode);
        }

        this.main.tree.convertToStringForAVL(avlStack);
        this.avlString.value = this.main.tree.string;
        this.main.tree.string = "";
    }
}