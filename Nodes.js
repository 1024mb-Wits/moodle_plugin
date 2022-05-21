class Node {

    constructor(x, y, Num_In_Node, Arr_Index) {
        this.x = x; //x coordinate of node
        this.y = y; //y coordinate of node
        this.Num_In_Node = Num_In_Node; //number contained inside of node
        this.Arr_Index = Arr_Index;
        this.isRoot = false;
        this.Is_Selected = false;
        this.LC = null;
        this.RC = null;
    }


    GetX() {

        return this.x;

    }
    GetY() {

        return this.y;

    }

    SetX(new_x) {

        this.x = new_x

    }
    SetY(new_y) {

        this.y = new_y;

    }

    SetNodeNum(newnum) {
        this.Num_In_Node = newnum;
    }

    setRoot(bool) {
        this.isRoot = bool;
    }

    GetNodeNum() {
        return this.Num_In_Node;
    }

    GetRoot() {
        return this.isRoot;
    }

    GetArrIndex() {
        return this.Arr_Index;
    }

    SetArrIndex(New_Ind) {
        this.Arr_Index = New_Ind;
    }
    GetIs_Selected() {

        return this.Is_Selected;
    }
    SetIs_Selected(Selected) {

        this.Is_Selected = Selected;
    }
    SetLeftChild(Left_Child) {
        this.LC = Left_Child;
    }
    SetRightChild(Right_Child) {
        this.RC = Right_Child;
    }
    GetLeftChild() {
        return this.LC;
    }
    GetRightChild() {
        return this.RC;
    }






}
class Edge {

    constructor(Node_1, Node_2) { //the index of the nodes being connected by an edge
        this.Node_1 = Node_1;
        this.Node_2 = Node_2;
    }

    GetNode_1() {
        return this.Node_1;

    }

    GetNode_2() {
        return this.Node_2;

    }
    SetNode_1(N1) {
        this.Node_1 = N1;

    }

    SetNode_2(N2) {
        this.Node_2 = N2;

    }


}
var canvas; // The canvas element on which we== will draw.
var graphics; // A 2D graphics context for drawing on the canvas.
var startX, startY;
var addNodes, deleteNodes,moveNodes = false; // a boolean variable that determines whether the user wants to move the nodes or not
let n = 0; //Node number
var Added_Nodes; //stores all of the nodes that has been added to the canvas
Added_Nodes = new Array();
var Added_Edges = new Array();
var subtree = new Array();
var dummyNode = new Node(820, 620, -1, n);
var IsSelected = false;
const Selected_Nodes = [-1, -1]; //tuple containing the nodes currently selected ,can have just one node selected or both
Added_Nodes.push(dummyNode);
var Node_Selected;
var count = 0;
var x, y;


function sum(a, b) {
    return a + b;
}
function installMouseHandler() {

    var dragging = false; // set to true when a drag action is in progress.
    // coordinates of mouse at start of drag.
    function doMouseDown(evt) {
        // This function is called when the user presses a button on the mouse.
        // Only the main mouse button will start a drag.
        if (dragging) {
            return; // if a drag is in progress, don't start another.
        }
        if (evt.button != 0) {
            return; // don't respond unless the button is the main (left) mouse button.
        }
        // mouse position in canvas coordinates

        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left); // translate mouse position from screen coords to canvas coords.
        y = Math.round(evt.clientY - r.top);

        if (x > 800 || y > 600) {
            return;

        }
        dragging = true;
        Node_Selected = Check_Clicked(x, y);
        graphics.clearRect(0, 0, canvas.width, canvas.height);
        DrawAllEdges();
        DrawAllNodes();

        console.log("clicked on " + Node_Selected.GetNodeNum())

        if (Node_Selected.GetNodeNum() != -1 && Node_Selected.GetIs_Selected()) {
            openPopup();

        } else {
            closePopup();
        }
        if (dragging) {
            startX = prevX = x;
            startY = prevY = y;
            document.addEventListener("mousemove", doMouseMove, false);
            document.addEventListener("mouseup", doMouseUp, false);
        }
    }

    function doMouseMove(evt) {
        // This function is called when the user moves the mouse during a drag.
        if (!dragging) {
            return; // (shouldn't be possible)
        }
        var x, y; // mouse position in canvas coordinates
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);
        y = Math.round(evt.clientY - r.top);

        /*------------------------------------------------------------*/
        /* TODO: Add support for more drawing tools. */

        //var Node_Selected = Check_Clicked(evt);
        if (Node_Selected.GetNodeNum() == -1) {
            return;
        } else {
            graphics.clearRect(0, 0, canvas.width, canvas.height);
            var Old_x = Node_Selected.GetX();
            var Old_y = Node_Selected.GetY();
            Node_Selected.SetX(x);
            Node_Selected.SetY(y);
            var X_Diff = x - Old_x;
            var Y_Diff = y - Old_y;
            Apply_Tree_Move(X_Diff, Y_Diff, Node_Selected);
            DrawNewNode(Node_Selected);
        }

        DrawAllEdges();
        DrawAllNodes();

        /*------------------------------------------------------------*/

        prevX = x; // update prevX,prevY to prepare for next call to doMouseMove
        prevY = y;

    }

    function doMouseUp(evt) {
        // This function is called when the user releases a mouse button during a drag.

        if (!dragging) {

            //MoveNode(evt);
            return; // (shouldn't be possible)

        }
        dragging = false;
        graphics.clearRect(0, 0, canvas.width, canvas.height);
        DrawAllEdges();
        DrawAllNodes();

        document.removeEventListener("mousemove", doMouseMove, false);
        document.removeEventListener("mouseup", doMouseMove, false);
    }

    canvas.addEventListener("mousedown", doMouseDown, false);

} // end installMouseHandler

function addGraphicsContextExtras(graphics) {
    graphics.strokeLine = function(x1, y1, x2, y2) {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.stroke();
    }
    graphics.fillCircle = function(x, y, r) {
        this.beginPath();
        this.arc(x, y, r, 0, 2 * Math.PI, false);
        this.fill();
    }
    graphics.strokeCircle = function(x, y, radius) {
        this.beginPath();
        this.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.stroke();
    }
} // end of addGraphicsContextExtras()

function DrawNewNode(Node, color) { //draws a new node
    graphics.save();
    graphics.fillStyle = "white";
    graphics.strokeStyle = color;
    graphics.fillCircle(Node.GetX(), Node.GetY(), 35);
    graphics.strokeCircle(Node.GetX(), Node.GetY(), 35);
    graphics.restore();

    //draws the node number inside the cirlce
    graphics.save();
    graphics.font = "15px Arial";
    graphics.fillStyle = "black";
    graphics.fillText(Node.GetNodeNum(), Node.GetX() - 5, Node.GetY() + 2.5);
    graphics.restore();

}

function Apply_Tree_Move(x_change, y_change, Root_Num) {

    for (let j = 1; j < subtree.length; j++) {

        for (let i = 0; i < Added_Nodes.length; i++) {
            if (subtree[j].GetNodeNum() == Added_Nodes[i].GetNodeNum()) {
                ("Changing " + subtree[j]);
                Added_Nodes[i].SetX(Added_Nodes[i].GetX() + x_change);
                Added_Nodes[i].SetY(Added_Nodes[i].GetY() + y_change);
            }

        }
    }
}


function joinNodes(check) {
    var pcheck = check;

    console.log("selected nodes ", Selected_Nodes[0], " : ", Selected_Nodes[1]);

    //first check if 2 nodes are selected
    //then check if the nodes that are selected arent already connected
    var New_Edge = new Edge(Selected_Nodes[0], Selected_Nodes[1]);
    var flag1 = false;
    var flag2 = true;
    for (let i = 0; i < Added_Edges.length; i++) {
        if ((New_Edge.GetNode_1() == Added_Edges[i].GetNode_1() && New_Edge.GetNode_2() == Added_Edges[i].GetNode_2())) {

            console.log("cannot add edge. edges array-->", Added_Edges);
            flag1 = true;
        }
        if ((New_Edge.GetNode_1() == Added_Edges[i].GetNode_2() && New_Edge.GetNode_2() == Added_Edges[i].GetNode_1())) {
            console.log("cannot add edge. edges array-->", Added_Edges);
            flag1 = true;
        }
    }

    if (Selected_Nodes[0] != -1 && Selected_Nodes[1] != -1) {
        flag2 = false;
    }

    if (flag2 == false && flag1 == false) {
        for (let i = 0; i < Added_Nodes.length; i++) {
            if (Added_Nodes[i].GetNodeNum() == Selected_Nodes[0]) {
                var Node_1 = Added_Nodes[i];
            }
            if (Added_Nodes[i].GetNodeNum() == Selected_Nodes[1]) {
                var Node_2 = Added_Nodes[i];
            }

        }


        //since nodes are connected, they form part of the tree
        if (Node_1.GetY() < Node_2.GetY()) { // determine which is parent node based on position
            pcheck = 1;
        } else {
            pcheck = 2;
        }

        if (pcheck == 1) { //the first node is the parent now determine whether the second is a left child or right
            if (Node_1.GetX() < Node_2.GetX()) { //0 is false, 1 is true
                var treeNode1 = new Tree_Node(0, 1, Node_1.GetNodeNum(), 0, Node_1.GetNodeNum(), 0, 0);
                Node_1.SetRightChild(Node_2);
            } else { // its a right child
                Node_1.SetLeftChild(Node_2);
            }


        } else { // the second node is the parent

            if (Node_2.GetX() < Node_1.GetX()) {
                Node_2.SetRightChild(Node_1);

            } else {

                Node_2.SetLeftChild(Node_1);
            }


        }

        //Add new edge to edge array

        Added_Edges.push(New_Edge);
        console.log("Added edge ", Added_Edges);
        return ("Nodes are connected");
    } else {
        return ("Choose another node to connect / Nodes are already Connected");
    }

}


function PreOrderTraversal(Root) {
    if (Root == null) {
        return;
    }
    subtree.push(Root);
    PreOrderTraversal(Root.GetLeftChild());
    PreOrderTraversal(Root.GetRightChild());

    return ("Tree Traversed");
}

function PrintSubTree() {
    nodenums = new Array();

    for (let i = 0; i < subtree.length; i++) {

        nodenums.push(subtree[i].GetNodeNum());

    }
    console.log(nodenums);

    return nodenums;

}
function DrawAllEdges() {
    for (let i = 0; i < Added_Edges.length; i++) {
        var Val_1 = Added_Edges[i].GetNode_1();
        var Val_2 = Added_Edges[i].GetNode_2();
        var Node_1;
        var Node_2;
        for (let j = 0; j < Added_Nodes.length; j++) {
            if (Val_1 == Added_Nodes[j].GetNodeNum()) {
                Node_1 = Added_Nodes[j];
            } else if (Val_2 == Added_Nodes[j].GetNodeNum()) {
                Node_2 = Added_Nodes[j];
            }
        }
        graphics.save();
        graphics.strokeStyle = 'black';
        graphics.strokeLine(Node_1.GetX(), Node_1.GetY(), Node_2.GetX(), Node_2.GetY());
        graphics.restore();
    }
}



function addNode(posx, posy, num) {
    n++; //increments the index of the Node
    var New_Node = new Node(posx, posy, num, n); //create new node
    //DrawNewNode(New_Node, "black"); //draw node on canvas
    Added_Nodes.push(New_Node); // DO NOT CALL ANY GRAPHIC FUNCTIONS IN THE TESTS
    const { x, y, Num_In_Node } = Added_Nodes[n];
    console.log("Selected Nodes are", Selected_Nodes);
    return { x, y, Num_In_Node };
}




//Fix array indices after deletion
function FxIndDel(Del_At) {
    for (let i = Del_At; i < Added_Nodes.length; i++) { //starting from where we deleted till the end of the array
        Added_Nodes[i].SetArrIndex(i); //pushing back the index by 1 since a deketion occured before it
    }
    return Added_Nodes;

}

function deleteNode(nodenum, nodeindx) {
    //var Node_Selected = Check_Clicked(evt);

    if (nodenum == Selected_Nodes[0] && Selected_Nodes[1] != -1) {
        Selected_Nodes[0] = Selected_Nodes[1];
        Selected_Nodes[1] = -1;
    } else if (nodenum == Selected_Nodes[0]) {
        Selected_Nodes[0] = Selected_Nodes[1];
    } else if (nodenum == Selected_Nodes[1]) {
        Selected_Nodes[1] = -1;
    }
    console.log("deleting node : " + nodenum);

    count--;
    console.log("Selected Nodes are", Selected_Nodes);
    for (let i = 0; i < Added_Nodes.length; i++) {
        if (Added_Nodes[i].GetLeftChild() == Node_Selected) {
            Added_Nodes[i].SetLeftChild(null);
        }

        if (Added_Nodes[i].GetRightChild() == Node_Selected) {
            Added_Nodes[i].SetRightChild(null);
        }

    }


    for (let i = 0; i < Added_Edges.length; i++) {
        if (Added_Edges[i].GetNode_1() == nodenum || Added_Edges[i].GetNode_2() == nodenum) {
            //we need to delete this edge
            Added_Edges.splice(i, 1);
            i--;

        }
    }
    const { x, y, Num_In_Node } = Added_Nodes[nodeindx];

    Added_Nodes.splice(nodeindx, 1);
    FxIndDel(nodeindx);
    console.log(Added_Nodes.length);

    Added_Nodes.map((Node) => {
        const { x, y, Num_In_Node } = Node;
        console.log({ x, y, Num_In_Node });
    })

    n--;

    console.log("Edges are -->", Added_Edges);
    return { x, y, Num_In_Node };

}

function DrawAllNodes() {
    for (let i = 0; i < Added_Nodes.length; i++) {

        if (Added_Nodes[i].GetIs_Selected() == true) {
            if (Added_Nodes[i].GetRoot() == true) {
                DrawNewNode(Added_Nodes[i], "red");
            } else {
                DrawNewNode(Added_Nodes[i], "blue");
            }
        } else {
            DrawNewNode(Added_Nodes[i], "black");
        }

    }

}

//This function checks whether a node has been clicked or not
function Check_Clicked(currentx, currenty) { //current mouse position on canvas

    Node_Selected = new Node(605, 605, -1, 0);
    if (IsSelected == false) {
        var x_coord; //centre of the circle
        var y_coord;
        var Node_Selected = new Node(300, 300, -1);
        var Node_dummy = new Node(-1, -1, -1, -1);
        var checkDist = 0;
        for (let i = 0; i < Added_Nodes.length; i++) {
            x_coord = Added_Nodes[i].GetX();
            y_coord = Added_Nodes[i].GetY();
            checkDist = Math.sqrt(Math.pow((currentx - x_coord), 2) + Math.pow((currenty - y_coord), 2));

            //Checking if the clicked position is contained within or on a circle(Node)
            if (checkDist <= 35) { //user clicked Node
                Node_Selected = Added_Nodes[i]; //Get the selected node
                //console.log( Added_Nodes[i].GetIs_Selected());
                if (Added_Edges.length > 0) {
                    subtree = new Array();
                    console.log(PreOrderTraversal(Node_Selected));
                    PrintSubTree();
                }
                //Check if node has already been selected
                if (Added_Nodes[i].GetIs_Selected() !== true) {
                    //If Node is not selected
                    //Draw blue outline around node indicating that it is selected
                    Added_Nodes[i].SetIs_Selected(true);
                    console.log(Added_Nodes[i].GetNodeNum(), " ", "Node is being selected");

                    if (Selected_Nodes[0] == -1) { //first index is empty so we add to the first element
                        Selected_Nodes[0] = Added_Nodes[i].GetNodeNum();
                        count++;

                    } else if (Selected_Nodes[1] == -1) { //this means first element is taken
                        Selected_Nodes[1] = Added_Nodes[i].GetNodeNum();
                        count++;
                    } else if (Selected_Nodes[1] !== Added_Nodes[i].GetNodeNum() && count == 2) {
                        // selects a third node, so deselect the second node

                        for (let j = 0; j < Added_Nodes.length; j++) {
                            if (Added_Nodes[j].GetNodeNum() == Selected_Nodes[0]) {
                                var Nodeindex = j;
                            }


                        }
                        Added_Nodes[Nodeindex].SetIs_Selected(false);
                        Selected_Nodes[0] = Selected_Nodes[1];
                        Selected_Nodes[1] = Added_Nodes[i].GetNodeNum();
                    }
                    console.log("number of nodes selected is: ", count);
                    console.log("Nodes selected are: ", Selected_Nodes);

                } else {
                    //we need to remove blue outline to indicate that the node is being deselected
                    console.log(Added_Nodes[i].GetNodeNum(), "Deselected node");
                    Added_Nodes[i].SetIs_Selected(false);
                    if (Selected_Nodes[0] == Added_Nodes[i].GetNodeNum()) { //first index is empty so we add to the first element
                        Selected_Nodes[0] = -1;
                        count--;
                    } else if (Selected_Nodes[1] == Added_Nodes[i].GetNodeNum()) { //this means first element is taken
                        Selected_Nodes[1] = -1;
                        count--;
                    }
                    console.log("number of nodes selected is: ", count);
                    console.log("nodes selected is: ", Selected_Nodes);
                }

            }
        }

        return Node_Selected;

    } else {
        IsSelected = false;
        return Node_dummy;
    }


}

function editNode(num, nodenum, nodeindx) {
    for (let i = 0; i < Added_Edges.length; i++) { // change the node number across edges array
        if (Added_Edges[i].GetNode_1() == nodenum) {
            Added_Edges[i].SetNode_1(num);
        }
        if (Added_Edges[i].GetNode_2() == nodenum) {
            Added_Edges[i].SetNode_2(num);
        }
    }

    if (Selected_Nodes[0] == nodenum) {
        Selected_Nodes[0] = num;
    } else {
        Selected_Nodes[1] = num;
    }

    Added_Nodes[nodeindx].SetNodeNum(num);

    for (let i = 0; i < Added_Nodes.length; i++) {
        if (Added_Nodes[i].GetLeftChild() != null || Added_Nodes[i].GetRightChild() != null) {
            if (Added_Nodes[i].GetLeftChild().GetNodeNum() == nodenum) {
                Added_Nodes[i].GetLeftChild().SetNodeNum(num);
            }

            if (Added_Nodes[i].GetRightChild().GetNodeNum() == nodenum) {
                Added_Nodes[i].GetRightChild().SetNodeNum(num);
            }
        }

    }

    return (num);


}
module.exports = { sum, addNode, deleteNode, Check_Clicked, joinNodes, PrintSubTree, editNode };
function getVal() { // gets the value from the input box
    const val = document.getElementById("nodenum").value;
    return val;
}
function paintComponent(whichSelection) { // gets the operation from the user
    console.log(whichSelection);
    switch (whichSelection) {
        case "0": // user chooses to add nodes
            addNodes = true;
            moveNodes = false;
            deleteNodes = false;
            connectNodes = false;
            break;
        case "2": // user chooses to delete nodes
            addNodes = false;
            moveNodes = false;
            deleteNodes = true;
            connectNodes = false;
            break;
    }
}

function doNodeOperations(evt) {
    if (addNodes) {
        num = getVal(); //gets the number to be drawn inside a node
        addNode(x, y, num);
        DrawAllNodes();
        document.getElementById("nodenum").focus();
    }

    if (deleteNodes && (n != 0)) {
        //function to delete nodes
        nnum = Node_Selected.GetNodeNum();
        indnum = Node_Selected.GetArrIndex();
        deleteNode(nnum, indnum);
        graphics.clearRect(0, 0, canvas.width, canvas.height);
        DrawAllEdges();
        DrawAllNodes();
    }

    if (moveNodes) {
        //MoveNode(evt);
    }


}

function init() {
    canvas = document.getElementById("canvas");
    graphics = canvas.getContext("2d");
    try {
        canvas = document.getElementById("canvas");
        graphics = canvas.getContext("2d");
    } catch (e) {
        document.getElementById("canvasholder").innerHTML =
            "<p>Canvas graphics is not supported.<br>" +
            "An error occurred while initializing graphics.</p>";
        return;
    }
    addGraphicsContextExtras(graphics);
    installMouseHandler();
    graphics.fillStyle = "white";
    graphics.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("canvas").addEventListener("dblclick", doNodeOperations);
    document.getElementById("canvas").addEventListener("contextmenu", doNodeOperations); // double click on the canvas to add a node
}