
 public function do_preorder_transversal($node)
    {
        #If the node is empty, end the recursion
        if(empty($node)) return $this->preorderedNodes;
        #Start the transversal
        if($node == 'head' && !empty($this->treeNodes[0])) $node=$this->treeNodes[0]; 

        #Add the node to the pre-ordered node list
        array_push($this->preorderedNodes, $node);

        $leftChild = $node->get_left_child(); 
        $rightChild = $node->get_right_child(); 
        if(!empty($leftChild)) $this->do_preorder_transversal($this->set_node_object($leftChild));
        if(!empty($rightChild)) $this->do_preorder_transversal($this->set_node_object($rightChild));
    }
