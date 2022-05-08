
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

        class Tree_Node { //used for representing a node in the tree as a string
            constructor(Root, Is_Parent, Node_val, Parent_Node, LC, RC) {
                this.Root = Root
                this.Is_Parent = Is_Parent;
                this.Node_val = Node_val;
                this.LC = LC;
                this.RC = RC;
                this.Parent_Node = Parent_Node;
            }
        }


        var canvas;    // The canvas element on which we== will draw.
        var graphics;  // A 2D graphics context for drawing on the canvas.
        var startX, startY;
        var addNodes, deleteNodes, connectNodes, moveNodes = false; // a boolean variable that determines whether the user wants to move the nodes or not
        let n = 0; //Node number
        var Added_Nodes; //stores all of the nodes that has been added to the canvas
        Added_Nodes = new Array();
        var Added_Edges = new Array();
        var subtree = new Array();
        var dummyNode = new Node(820, 620, -1, n);
        var previous_x = -1;//x coordinate of node that was selected previously
        var previous_y = -1; //y coordinate
        var IsSelected = false;
        var Node_ToMove;
        const Selected_Nodes = [-1, -1]; //tuple containing the nodes currently selected ,can have just one node selected or both
        Added_Nodes.push(dummyNode);
        //addNode(820,620,-1)

        var Node_Selected;

        var drag_node;
        var count = 0;

        var rootexists = false;
        var numroots = 0;

        var x, y; 


        function sum(a, b) {
            return a + b;
          }
        //module.exports = sum;
        


        function installMouseHandler() {

            var dragging = false;  // set to true when a drag action is in progress.
            // coordinates of mouse at start of drag.
            var prevX, prevY;      // previous mouse position during a drag.

            var colorChoice;  // Integer code for the selected color in the "colorChoide"
            // popup menu.  The value is assigned in doMouseDown.


            function doMouseDown(evt) {
                // This function is called when the user presses a button on the mouse.
                // Only the main mouse button will start a drag.
                if (dragging) {
                    return;  // if a drag is in progress, don't start another.
                }
                if (evt.button != 0) {
                    return; // don't respond unless the button is the main (left) mouse button.
                }
                 // mouse position in canvas coordinates

                var r = canvas.getBoundingClientRect();
                x = Math.round(evt.clientX - r.left);  // translate mouse position from screen coords to canvas coords.
                y = Math.round(evt.clientY - r.top);

                if (x > 800 || y > 600) {
                    return;

                }
                dragging = true;
                Node_Selected = Check_Clicked(x,y);
                graphics.clearRect(0, 0, canvas.width, canvas.height);
                DrawAllEdges();
                DrawAllNodes();



                //drag_node = Node_Selected;
                //console.log("x" + Node_Selected.GetNodeNum())


                console.log("clicked on " + Node_Selected.GetNodeNum())

                if (Node_Selected.GetNodeNum() != -1 && Node_Selected.GetIs_Selected()) {
                    openPopup();

                }
                else {
                    closePopup();
                }


                // round to integer values; some browsers would give non-integers.
                // (this won't be the case for all mousedowns in all programs)
                if (dragging) {
                    startX = prevX = x;
                    startY = prevY = y;


                    document.addEventListener("mousemove", doMouseMove, false);
                    document.addEventListener("mouseup", doMouseUp, false);
                }

                //colorChoice = Number(document.getElementById("colorChoice").value);
                // TODO: Anything else to do when mouse is first pressed?
            }

            function doMouseMove(evt) {
                // This function is called when the user moves the mouse during a drag.
                if (!dragging) {
                    return;  // (shouldn't be possible)
                }
                var x, y;  // mouse position in canvas coordinates
                var r = canvas.getBoundingClientRect();
                x = Math.round(evt.clientX - r.left);
                y = Math.round(evt.clientY - r.top);

                /*------------------------------------------------------------*/
                /* TODO: Add support for more drawing tools. */

                //var Node_Selected = Check_Clicked(evt);
                if (Node_Selected.GetNodeNum() == -1) {
                    return;
                }
                else {
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

                prevX = x;  // update prevX,prevY to prepare for next call to doMouseMove
                prevY = y;

            }

            function doMouseUp(evt) {
                // This function is called when the user releases a mouse button during a drag.

                if (!dragging) {

                    //MoveNode(evt);
                    return;  // (shouldn't be possible)

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
            graphics.strokeLine = function (x1, y1, x2, y2) {
                this.beginPath();
                this.moveTo(x1, y1);
                this.lineTo(x2, y2);
                this.stroke();
            }
            graphics.fillCircle = function (x, y, r) {
                this.beginPath();
                this.arc(x, y, r, 0, 2 * Math.PI, false);
                this.fill();
            }
            graphics.strokeCircle = function (x, y, radius) {
                this.beginPath();
                this.arc(x, y, radius, 0, 2 * Math.PI, false);
                this.stroke();
            }
            graphics.fillPoly = function () {
                if (arguments.length < 6)
                    return;
                this.beginPath();
                this.moveTo(arguments[0], arguments[1]);
                for (var i = 2; i + 1 < arguments.length; i = i + 2) {
                    this.lineTo(arguments[i], arguments[i + 1]);
                }
                this.closePath();
                this.fill();
            }
            graphics.strokePoly = function () {
                if (arguments.length < 4)
                    return;
                this.beginPath();
                this.moveTo(arguments[0], arguments[1]);
                for (var i = 2; i + 1 < arguments.length; i = i + 2) {
                    this.lineTo(arguments[i], arguments[i + 1]);
                }
                this.closePath();
                this.stroke();
            }
            graphics.fillOval = function (x, y, horizontalRadius, verticalRadius) {
                this.save();
                this.translate(x, y);
                this.scale(horizontalRadius, verticalRadius);
                this.beginPath();
                this.arc(0, 0, 1, 0, 2 * Math.PI, false);
                this.restore();
                this.fill();
            }
            graphics.strokeOval = function (x, y, horizontalRadius, verticalRadius) {
                this.save();
                this.translate(x, y);
                this.scale(horizontalRadius, verticalRadius);
                this.beginPath();
                this.arc(0, 0, 1, 0, 2 * Math.PI, false);
                this.restore();
                this.stroke();
            }
            graphics.getRGB = function (x, y) {
                var color = this.getImageData(x, y, 1, 1);
                return color.data;
            }
        }    // end of addGraphicsContextExtras()

        function DrawNewNode(Node, color) { //draws a new node
            //draws the white circle that represents a nodes
            var Delx;
            var Dely;
            var Editx;
            var Edity;

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


        function Move_Other_Nodes() {//gets root node from canvas
            
        }

        function Apply_Tree_Move(x_change, y_change, Root_Num) {

            
        }


        function joinNodes(check) {
  

        }


        function PreOrderTraversal(Root) {

            

        }

        function PrintSubTree() {
            
        }

        function printTree(a){
           
        }

        function DrawAllEdges() {
            
        }



        function addNode(posx,posy,num) {
            //var r = canvas.getBoundingClientRect();
            
            //var num = 0;

            

        }

        


        //Fix array indices after deletion
        function FxIndDel(Del_At) {
            
        }

        function deleteNode(nodenum,nodeindx) {
            //var Node_Selected = Check_Clicked(evt);


        }
        


        function DrawAllNodes() {
            

        }

        //This function checks whether a node has been clicked or not
        function Check_Clicked(currentx,currenty) { //current mouse position on canvas

        }

        function editNode(num,nodenum,nodeindx){

           
        }

        module.exports ={ sum, addNode, deleteNode, Check_Clicked, joinNodes,PrintSubTree, editNode };



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
                case "1": // user chooses to move nodes
                    addNodes = false;
                    moveNodes = true;
                    deleteNodes = false;
                    connectNodes = false;
                    break;
                case "2": // user chooses to delete nodes
                    addNodes = false;
                    moveNodes = false;
                    deleteNodes = true;
                    connectNodes = false;
                    break;
                case "3": // user chooses to connect nodes
                    addNodes = false;
                    moveNodes = false;
                    deleteNodes = false;
                    connectNodes = true;
                    break;
            }
        }
        function doNodeOperations(evt) {
            if (addNodes) {
                num = getVal();//gets the number to be drawn inside a node
                addNode(x,y,num);
                DrawAllNodes();
                document.getElementById("nodenum").focus();
            }

            if (deleteNodes && (n != 0)) {
                //function to delete nodes
                nnum = Node_Selected.GetNodeNum();
                indnum = Node_Selected.GetArrIndex();
                deleteNode(nnum,indnum);
                graphics.clearRect(0, 0, canvas.width, canvas.height);
                DrawAllEdges();
                DrawAllNodes();
            }

            if (moveNodes) {
                //MoveNode(evt);
            }


        }

        function printEdges() {
            console.log(Added_Edges);
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

            //document.getElementById("buttonAddNodeNumber").addEventListener("click",getVal);

            //document.getElementById("canvas").onclick = OnCanvasClick;
            document.getElementById("canvas").addEventListener("dblclick", doNodeOperations);
            document.getElementById("canvas").addEventListener("contextmenu", doNodeOperations);// double click on the canvas to add a node
        }