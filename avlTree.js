class avlNode{
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.height = 1;


    }

}
class avlTree{
    constructor() {
        this.root = null;


    }

    getHeight(node){

        if (node == null) return 0;
 
          return node.height;



    }

    getBalance(node){
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    findMin(node){

        while(node.left)
            node = node.left;
        return node.data;
    }

    leftRotation(node){

        var y = node.right;
        var yLeftChild = y.left;

        y.left = node;
        node.right = yLeftChild;

        node.height = Math.max(this.getHeight(node.left),this.getHeight(node.right)) +1;
        y.height = Math.max(this.getHeight(y.left),this.getHeight(y.right)) +1 ;

        return y;


    }

    rightRotation(node){

        const y = node.left;
        const yRightChild = y.right;

        y.right = node;
        node.left = yRightChild;

        node.height = Math.max(this.getHeight(node.left),this.getHeight(node.right)) +1;
        y.height = Math.max(this.getHeight(y.left),this.getHeight(y.right)) +1 ;

        return y;



    }
    //insert a given node
    insert(data,node){

        if(node == null){
            return new avlNode(data);

        }

        if(data < node.data){
            node.left = this.insert(data,node.left);
        }
        else if(data > node.data){
            node.right = this.insert(data,node.right);
        }

        else{
            return node;
        }

        node.height = Math.max(this.getHeight(node.left),this.getHeight(node.right)) + 1;

        if(this.getBalance(node) == 2 && this.getBalance(node.left) >= 0){ //LL case
            return this.rightRotation(node);
        }
        else if(this.getBalance(node) == 2 && this.getBalance(node.left) < 0){ //LR case
            node.left = this.leftRotation(node.left);
            return this.rightRotation(node);
        }
        else if(this.getBalance(node) == -2 && this.getBalance(node.right) <= 0){ // RR case
            return this.leftRotation(node);
        }
        else if(this.getBalance(node) == -2 && this.getBalance(node.right) > 0){ // RL case
            node.right = this.rightRotation(node.right);
            return this.leftRotation(node);
        }


        return node;





    }
    // delete a given node
    delete(data,node){

        if(data < node.data && node.left){
            node.left = this.delete(data,node.left);
        }

        else if(data > node.data && node.right){
            node.right = this.delete(data,node.right);
        }

        else{

            if(node.data == data){

                if(node.right && node.left){
                    let minVal = this.findMin(node.right);
                    node.data = minVal;
                    node.right = this.delete(minVal,node.right);
                }

                else if(node.left){
                    return node.left;
                }

                else if(node.right){
                    return node.right;
                }

                else{
                    return null;
                }
            }

        }
        node.height = Math.max(this.getHeight(node.left),this.getHeight(node.right)) +1;

        if(this.getBalance(node) == 2 && this.getBalance(node.left) >= 0){ //LL case
            return this.rightRotation(node);
        }
        else if(this.getBalance(node) == 2 && this.getBalance(node.left) < 0){ //LR case
            node.left = this.leftRotation(node.left);
            return this.rightRotation(node);
        }
        else if(this.getBalance(node) == -2 && this.getBalance(node.right) <= 0){ // RR case
            return this.leftRotation(node);
        }
        else if(this.getBalance(node) == -2 && this.getBalance(node.right) > 0){ // RL case
            node.right = this.rightRotation(node.right);
            return this.leftRotation(node);
        }


        return node;



    }

   
    // pre order traversal to print out tree
    preOrder(node) {
        if (node != null) {
          document.write(node.data + " ");
          this.preOrder(node.left);
          this.preOrder(node.right);
        }
      }

    
  

  

}

// test code to print out tree
let avlTreeNode = new avlTree();

avlTreeNode.root = avlTreeNode.insert(10,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(20,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(30,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(40,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(50,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(25,avlTreeNode.root);
avlTreeNode.root = avlTreeNode.insert(60,avlTreeNode.root);
//avlTreeNode.root = avlTreeNode.delete(30,avlTreeNode.root);


avlTreeNode.preOrder(avlTreeNode.root);


