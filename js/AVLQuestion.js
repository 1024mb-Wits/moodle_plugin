class AVLQuestion {
    constructor(main) {
        this.main = main;

        this.radio = document.querySelector('[qtype_name="AVL"]');
        this.randomValuesRadio = document.querySelector('[AVL_value_type="random"]');
        this.inputValuesRadio = document.querySelector('[AVL_value_type="supplied"]');
        this.nodeAmountInput = document.getElementById("id_node_amount");
        this.nodeValuesInput = document.getElementById("id_input_value");

        this.insertValueButton = document.getElementById("insert-AVL-value");
        this.undoInsertButton = document.getElementById("undo-insert-AVL-value");
        this.invalidAVLValueSpan = document.getElementById("invalid-AVL-value");

        this.nodeValuesInput.parentElement.insertBefore(this.invalidAVLValueSpan, this.nodeValuesInput.nextSibling);
        this.nodeValuesInput.parentElement.insertBefore(this.undoInsertButton, this.invalidAVLValueSpan);
        this.nodeValuesInput.parentElement.insertBefore(this.insertValueButton, this.undoInsertButton);

        this.AVLValueOptions = [this.randomValuesRadio, this.inputValuesRadio];

        this.nodeAmount = 0;
        this.randomAVLValues = [];
        this.insertedAVLValues = [];

        /** Values saved in DB */
        /** Holds the generated answer string to be compared to the student's answer */
        this.AVLString = document.getElementById("AVL_string");
        /** Holds the AVL values that are displayed to the student in AVLValueList */
        this.AVLValues = document.getElementById("AVLvalues");

        this.radio.addEventListener("change", this.updateQuestionType.bind(this));
        this.randomValuesRadio.addEventListener("change", this.updateRandomAVLValues.bind(this));
        this.inputValuesRadio.addEventListener("change", this.getInsertedAVLValuesFromArray.bind(this));
        this.nodeAmountInput.addEventListener("input", this.updateRandomAVLValues.bind(this));
        this.insertValueButton.addEventListener("click", this.updateInputAVLValues.bind(this));
        this.undoInsertButton.addEventListener("click", this.undoAVLValueInsert.bind(this));

        for(const AVLValueOption of this.AVLValueOptions) {
            AVLValueOption.parentElement.style.marginLeft += "30px";
        }
    }

    /** Called when 'Construct AVL' radio button is checked */
    updateQuestionType() {
        this.main.setup.updateCurrentQuestion("AVL");

        if(this.randomValuesRadio.checked) { // Random values. No need to account for if input values is checked since the list is just reconstructed anyway.
            this.updateRandomAVLValues();
        }
    }

    updateRandomAVLValues() {
        this.main.AVLValueList.value = "";
        this.AVLValues.value = "";
        this.randomAVLValues.length = 0; // Reset the list of previous AVL values
        this.nodeAmount = Number(this.nodeAmountInput.value);

        if(this.nodeAmount > (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE)) return; // If number of requested nodes is greater than possible unique values
        if(this.nodeAmount > this.main.ROWS * this.main.COLS) return;

        for(let i = 0; i < this.nodeAmount; i++) {
            let newValue = Math.floor(Math.random() * (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE) + this.main.MIN_NODE_VALUE);

            while(this.randomAVLValues.includes(newValue)) { // No duplicate values in AVL
                newValue = Math.floor(Math.random() * (this.main.MAX_NODE_VALUE - this.main.MIN_NODE_VALUE) + this.main.MIN_NODE_VALUE);
            }

            this.randomAVLValues.push(newValue);
            this.main.AVLValueList.value += newValue;
            this.AVLValues.value += newValue;
            
            if(i !== this.nodeAmount - 1) {
                this.main.AVLValueList.value += ", ";
                this.AVLValues.value += ", ";
            }
        }

        this.createAVLFromValues();
    }

    getInsertedAVLValuesFromArray() {
        this.insertValueButton.style.display = "inline-block"; 
        this.undoInsertButton.style.display = "inline-block";
        this.AVLValues.value = "";
        this.main.AVLValueList.value = "";
        
        if(this.insertedAVLValues.length > 0) {
            for(let i = 0; i < this.insertedAVLValues.length; i++) {
                if(this.AVLValues.value === "") {
                    this.AVLValues.value += this.insertedAVLValues[i];
                    this.main.AVLValueList.value += this.insertedAVLValues[i];
                }
                else {
                    this.AVLValues.value += ", " + this.insertedAVLValues[i];
                    this.main.AVLValueList.value += ", " + this.insertedAVLValues[i];
                }
            }
        }

        this.createAVLFromValues();
    }

    updateInputAVLValues() {
        if(isNaN(Number(this.nodeValuesInput.value)) || !Number.isInteger(Number(this.nodeValuesInput.value)) || 
            Number(this.nodeValuesInput.value) < this.main.MIN_NODE_VALUE || Number(this.nodeValuesInput.value) > this.main.MAX_NODE_VALUE ||
                this.insertedAVLValues.includes(Number(this.nodeValuesInput.value))) { // Invalid input
                    this.invalidAVLValueSpan.style.display = "inline-block";
                    this.invalidAVLValueSpan.innerHTML = "Please enter a unique integer between " + this.main.MIN_NODE_VALUE + " and " + this.main.MAX_NODE_VALUE + ".";
                    this.nodeValuesInput.focus();
        }
        else {
            this.invalidAVLValueSpan.style.display = "none";
            this.nodeValuesInput.value = this.nodeValuesInput.value.trim(); // Remove potential white space

            if(this.AVLValues.value === "") {
                this.AVLValues.value += this.nodeValuesInput.value;
                this.main.AVLValueList.value += this.nodeValuesInput.value;
            }
            else {
                this.AVLValues.value += ", " + this.nodeValuesInput.value;
                this.main.AVLValueList.value += ", " + this.nodeValuesInput.value;
            }

            this.insertedAVLValues.push(Number(this.nodeValuesInput.value));

            this.createAVLFromValues();

            this.nodeValuesInput.value = "";
            this.nodeValuesInput.focus();
        }
    }

    undoAVLValueInsert() {
        this.insertedAVLValues.pop();
        this.nodeValuesInput.focus();
        this.getInsertedAVLValuesFromArray();
    }

    createAVLFromValues() {
        if(this.main.AVLValueList.value === "") {
            this.AVLString.value = "";
            return;
        }

        let array = this.main.AVLValueList.value.split(",").map(value => parseInt(value));
        let AVLStack = []; // Needed to construct AVL answer string

        let rootValue = array[0];
        if(this.main.tree) {
            this.main.tree = null;
        }
        this.main.tree = new Tree(this.main, rootValue, false);
        AVLStack.push(this.main.tree.root);

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
            AVLStack.push(newNode);
        }

        this.main.tree.convertToStringForAVL(AVLStack);
        this.AVLString.value = this.main.tree.string;
        this.main.tree.string = "";
    }
}