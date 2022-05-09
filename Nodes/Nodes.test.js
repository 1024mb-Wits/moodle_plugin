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



const { sum, addNode, deleteNode, Check_Clicked, joinNodes,PrintSubTree, editNode } = require('./Nodes');
//const sum = require('./Nodes');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});



test("checks if node 35 is added with position", () => {
    const data = addNode(400, 48, 35);
    expect(data).toEqual({ x: 400, y: 48, Num_In_Node: 35 });
});

test("checks if node 21 added with position", () => {
    const data = addNode(212, 213, 21);
    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21 });
});

test("checks if node 19 added with position", () => {
    const data = addNode(118, 352, 19);
    expect(data).toEqual({ x: 118, y: 352, Num_In_Node: 19 });
});

test("checks if node 26 added with position", () => {
    const data = addNode(297, 359, 26);
    expect(data).toEqual({ x: 297, y: 359, Num_In_Node: 26 });
});

test("checks if node 46 added with position", () => {
    const data = addNode(572, 229, 46);
    expect(data).toEqual({ x: 572, y: 229, Num_In_Node: 46 });
});

test("checks if node 37 added with position", () => {
    const data = addNode(474, 374, 37);
    expect(data).toEqual({ x: 474, y: 374, Num_In_Node: 37 });
});

test("checks if node 49 added with position", () => {
    const data = addNode(604, 494, 49);
    expect(data).toEqual({ x: 604, y: 494, Num_In_Node: 49 });
});


//******************************************************************/

test("test to see if node 35 is clicked", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({ x: 400, y: 48, Num_In_Node: 35, Arr_Index: 1, isRoot: false, Is_Selected: true, LC: null, RC: null });
});

test("test to see if node 35 is deselected", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({ x: 400, y: 48, Num_In_Node: 35, Arr_Index: 1, isRoot: false, Is_Selected: false, LC: null, RC: null });
});

//************************delete 2 nodes ***************************************** */

test("checks if a node 21 is deleted with position", () => { // [-1,76,56,13]
    const data = deleteNode(21, 2);
    console.log(data);
    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21 });
});

NodetoTest = new Node(400, 350, 13, 3);

test("checks if a node 37 is deleted with position", () => { // [-1,76,56]
    const data = deleteNode(37, 5);
    expect(data).toEqual({ x: 474, y: 374, Num_In_Node: 37 });
});

//************************add nodes back ********************************************************* */

test("checks if node 21 added with position", () => { //[]
    const data = addNode(212, 213, 21);
    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21 });
});

test("checks if node 37 added with position", () => {
    const data = addNode(474, 374, 37);
    expect(data).toEqual({ x: 474, y: 374, Num_In_Node: 37 });
});

//*******************Select Node 35 and 21 *****************************/
test("test to see if node 35 is clicked", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({ x: 400, y: 48, Num_In_Node: 35, Arr_Index: 1, isRoot: false, Is_Selected: true, LC: null, RC: null });
});
test("test to see if node 21 is clicked", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21, Arr_Index: 6, isRoot: false, Is_Selected: true, LC: null, RC: null });
});

//*************************join nodes 35 and 21 *************************************** */

test("test to see if node 21 and 35 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});

//*******************deselect Node 35 and 21 *****************************/
test("test to see if node 35 is deselected", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({
        x: 400, y: 48, Num_In_Node: 35, Arr_Index: 1, isRoot: false, Is_Selected: false, LC:
        {
            Arr_Index: 6,
            Is_Selected: true,
            LC: null,
            Num_In_Node: 21,
            RC: null,
            isRoot: false,
            x: 212,
            y: 213,
        }, RC: null
    });
});
test("test to see if node 21 is deselected", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21, Arr_Index: 6, isRoot: false, Is_Selected: false, LC: null, RC: null });
});

//*******************Select Node 19(118, 352) and 21(212,213) *****************************/


test("test to see if node 21 is clicked", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual({ x: 212, y: 213, Num_In_Node: 21, Arr_Index: 6, isRoot: false, Is_Selected: true, LC: null, RC: null });
});

test("test to see if node 19 is clicked", () => {
    const data = Check_Clicked(118, 352);

    expect(data).toEqual({ x: 118, y: 352, Num_In_Node: 19, Arr_Index: 2, isRoot: false, Is_Selected: true, LC: null, RC: null });
});

//*************************join nodes 19 and 21 *************************************** */

test("test to see if node 21 and 19 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});


//*************************deselect nodes 19 and 21 *************************************** */

test("test to see if node 21 is deselected", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual({Arr_Index: 6, Is_Selected: false, LC: {Arr_Index: 2, Is_Selected: true, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352}, Num_In_Node: 21, RC: null, isRoot: false, x: 212, y: 213});
});
test("test to see if node 19 is deselected", () => {
    const data = Check_Clicked(118, 352);

    expect(data).toEqual({ x: 118, y: 352, Num_In_Node: 19, Arr_Index: 2, isRoot: false, Is_Selected: false, LC: null, RC: null });
});


//**************************Select nodes 21 and 26************************************************* */

test("test to see if node 21 is clicked", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual({Arr_Index: 6, Is_Selected: true, LC: {Arr_Index: 2, Is_Selected: false, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352}, Num_In_Node: 21, RC: null, isRoot: false, x: 212, y: 213});
});

test("test to see if node 26 is clicked", () => {
    const data = Check_Clicked(297, 359);

    expect(data).toEqual({ x: 297, y: 359, Num_In_Node: 26, Arr_Index: 3, isRoot: false, Is_Selected: true, LC: null, RC: null });
});


//*************************join nodes 26 and 21 *************************************** */

test("test to see if node 21 and 19 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});

//**************************Deselect nodes 21 and 26************************************************* */

test("test to see if node 21 is deselected", () => {
    const data = Check_Clicked(212, 213);

    expect(data).toEqual(
        {Arr_Index: 6, Is_Selected: false, LC: {Arr_Index: 2, Is_Selected: false, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352}, Num_In_Node: 21, 
        RC: {Arr_Index: 3, Is_Selected: true, LC: null, Num_In_Node: 26, RC: null, isRoot: false, x: 297, y: 359}, isRoot: false, x: 212, y: 213});
});

test("test to see if node 26 is deselected", () => {
    const data = Check_Clicked(297, 359);

    expect(data).toEqual({Arr_Index: 3, Is_Selected: false, LC: null, Num_In_Node: 26, RC: null, isRoot: false, x: 297, y: 359});
});

//**************************Select Node 35 and 46 ****************************************************************** */

test("test to see if node 35 is clicked", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({Arr_Index: 1, Is_Selected: true, LC: {Arr_Index: 6, Is_Selected: false,
        LC: {Arr_Index: 2, Is_Selected: false, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352},
         Num_In_Node: 21, RC: {Arr_Index: 3, Is_Selected: false, LC: null, Num_In_Node: 26, RC: null, isRoot: false, x: 297, y: 359},
        isRoot: false, x: 212, y: 213}, Num_In_Node: 35, RC: null, isRoot: false, x: 400, y: 48});
});

test("test to see if node 46 is clicked", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual( {Arr_Index: 4, Is_Selected: true, LC: null, Num_In_Node: 46, RC: null, isRoot: false, x: 572, y: 229});
});


//*************************join nodes 35 and 46 *************************************** */

test("test to see if node 35 and 46 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});

//**************************Deselect nodes 35 and 46************************************************* */

test("test to see if node 35 is deselected", () => {
    const data = Check_Clicked(400, 48);

    expect(data).toEqual({Arr_Index: 1, Is_Selected: false, LC: {Arr_Index: 6, Is_Selected: false, 
        LC: {Arr_Index: 2, Is_Selected: false, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352},
         Num_In_Node: 21, RC: {Arr_Index: 3, Is_Selected: false, LC: null, Num_In_Node: 26, RC: null, isRoot: false, x: 297, y: 359}, isRoot: false, x: 212, y: 213},
         Num_In_Node: 35, RC: {Arr_Index: 4, Is_Selected: true, LC: null, Num_In_Node: 46, RC: null, isRoot: false, x: 572, y: 229}, isRoot: false, x: 400, y: 48});
});

test("test to see if node 46 is deselected", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual(  {Arr_Index: 4, Is_Selected: false, LC: null, Num_In_Node: 46, RC: null, isRoot: false, x: 572, y: 229});
});

//**************************Select Node 46 and 37 ****************************************************************** */

test("test to see if node 46 is clicked", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual({Arr_Index: 4, Is_Selected: true, LC: null, Num_In_Node: 46,
        RC: null, isRoot: false, x: 572, y: 229});
});

test("test to see if node 37 is clicked", () => {
    const data = Check_Clicked(474, 374);

    expect(data).toEqual(
        {Arr_Index: 7, Is_Selected: true, LC: null, Num_In_Node: 37, 
        RC: null, isRoot: false, x: 474, y: 374});
});


//*************************join nodes 46 and 37 *************************************** */

test("test to see if node 46 and 37 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});

//**************************Deselect nodes 46 and 37 ************************************************* */

test("test to see if node 46 is deselected", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual({Arr_Index: 4, Is_Selected: false, LC: {Arr_Index: 7, Is_Selected: true, 
        LC: null, Num_In_Node: 37, RC: null, isRoot: false, x: 474, y: 374}, 
        Num_In_Node: 46, RC: null, isRoot: false, x: 572, y: 229});
});

test("test to see if node 37 is deselected", () => {
    const data =  Check_Clicked(474, 374);

    expect(data).toEqual({Arr_Index: 7, Is_Selected: false, LC: null, Num_In_Node: 37, 
        RC: null, isRoot: false, x: 474, y: 374});
});












//**************************Select Node 46 (572, 229 )and 49 (604,494) ****************************************************************** */

test("test to see if node 46 is clicked", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual({Arr_Index: 4, Is_Selected: true, LC: {Arr_Index: 7, Is_Selected: false, LC: null,
        Num_In_Node: 37, RC: null, isRoot: false, x: 474, y: 374}, Num_In_Node: 46, RC: null, isRoot: false, x: 572, y: 229});
});

test("test to see if node 49 is clicked", () => {
    const data = Check_Clicked(604,494);

    expect(data).toEqual(
        {Arr_Index: 5, Is_Selected: true, LC: null, Num_In_Node: 49, RC: null, isRoot: false, x: 604, y: 494});
});


//*************************join nodes 46 and 47 *************************************** */

test("test to see if node 46 and 49 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Nodes are connected");
});

//**************************Deselect nodes 46 and 37 ************************************************* */

test("test to see if node 46 is deselected", () => {
    const data = Check_Clicked(572, 229);

    expect(data).toEqual({Arr_Index: 4, Is_Selected: false, LC: {Arr_Index: 7, Is_Selected: false, LC: null, Num_In_Node: 37, RC: null, isRoot: false, x: 474, y: 374}, Num_In_Node: 46, RC: 
        {Arr_Index: 5, Is_Selected: true, LC: null, Num_In_Node: 49, RC: null, isRoot: false, x: 604, y: 494}, isRoot: false, x: 572, y: 229});
});

test("test to see if node 49 is deselected", () => {
    const data = Check_Clicked(604,494);

    expect(data).toEqual({Arr_Index: 5, Is_Selected: false, LC: null, Num_In_Node: 49, RC: null, isRoot: false, x: 604, y: 494});
});


//**************************join nodes validation****************************/
test("test to see if node 49 is Selected", () => {
    const data = Check_Clicked(604,494);

    expect(data).toEqual({Arr_Index: 5, Is_Selected: true, LC: null, Num_In_Node: 49, RC: null, isRoot: false, x: 604, y: 494});
});



test("test to see if node 46 and 49 join", () => {
    const data = joinNodes(0);

    expect(data).toBe("Choose another node to connect / Nodes are already Connected");
});





//*********************************test if node value can be editted***************************************** */

test("test to see if nodes can be edited", () => {
    const data = editNode(50,49,5);

    expect(data).toBe(50);
});

test("test to see if node 50 is deselected", () => {
    const data = Check_Clicked(604,494);

    expect(data).toEqual({Arr_Index: 5, Is_Selected: false, LC: null, Num_In_Node: 50, RC: null, isRoot: false, x: 604, y: 494});
});


//*******************************************35 is the root******************************************************* */
test("test to see if node 35 is clicked as root", () => {
    const data = Check_Clicked(400, 48);
    

    expect(data).toEqual({Arr_Index: 1, Is_Selected: true, LC: {Arr_Index: 6, Is_Selected: false, 
        LC: {Arr_Index: 2, Is_Selected: false, LC: null, Num_In_Node: 19, RC: null, isRoot: false, x: 118, y: 352}, Num_In_Node: 21, 
        RC: {Arr_Index: 3, Is_Selected: false, LC: null, Num_In_Node: 26, RC: null, isRoot: false, x: 297, y: 359}, isRoot: false, x: 212, y: 213}, Num_In_Node: 35, 
        RC: {Arr_Index: 4, Is_Selected: false, LC: {Arr_Index: 7, Is_Selected: false, LC: null, Num_In_Node: 37, RC: null, isRoot: false, x: 474, y: 374}
        , Num_In_Node: 46, RC: {Arr_Index: 5, Is_Selected: false, LC: null, Num_In_Node: 50, RC: null, isRoot: false, x: 604, y: 494}, isRoot: false, x: 572, y: 229}, 
        isRoot: false, x: 400, y: 48});
});

test("prints pre-order traversal of tree", () => {
    const data = PrintSubTree() ;

    expect(data).toEqual([35, 21, 19, 26, 46, 37, 50]);
});































