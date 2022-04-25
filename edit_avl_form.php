<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Defines the editing form for the avl question type.
 *
 * @package    qtype
 * @subpackage avl
 * @copyright  2022 adam gordon

 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();
global $DB;

/**
 * avl question editing form definition.
 *
 * @copyright  2022 adam gordon

 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_avl_edit_form extends question_edit_form {
    protected function definition_inner($mform) {

        $this->add_interactive_settings();

        //add header for selecting question type
        $mform->addElement('header', 'q_type_header', "AVl Question Type");
        //inside this header add following elements.
        $this->questionCategory($mform);
        $this->editTree($mform);
        $this->addInfo($mform);
        $this->constructTree($mform);
        $this->addTreeWidget($mform);

    }

    //defines elements related to what qustion category
    protected function addTreeWidget($mform)
    {
        $mform->addElement("header","build_tree","Build Your Tree");
        $mform->addElement('html', file_get_contents(new moodle_url('/question/type/avl/buildTree.html')));
    }
    protected function questionCategory($mform)
    {

        $menuQuestionCategory = array(
            "Info" => "Add Information About the Tree",
            "Edit" => "Edit a Given Tree",
            "Construct" => "Construct a Tree Given Certain Nodes"
        );
        $mform->addElement('select','question_category',"Question Category",$menuQuestionCategory);

    }

    //fucntion to add elements for the editing category
    protected function editTree($mform)
    {
        //create menu for what will be displayed
        $menuEditType=array(
            'Rotation'=>"Rotation",
            'Add'=>"Add Node",
            'Delete'=>"Delete Node"
        );
        $mform->addElement('select','editTreeOption',"Question Type - Edit Tree",$menuEditType);
        //hide this element if edit tree option not selected
        $mform->hideIf("editTreeOption","question_category",'neq',"Edit");
    }

    //fucntion to add elements for the adding categeory
    protected function addInfo($mform)
    {
        $menuAddInfo=array(
            "Height"=>'Height of Nodes',
            "Depth"=>'Depth of Nodes',
            'HeightTree'=>"Height Of Tree"
        );
        $mform->addElement('select','addInfoOption',"Question Type - Add Information about Tree",$menuAddInfo);
        $mform->hideIf("addInfoOption","question_category",'neq',"Info");
    }

    //fucntion to add elements for the constriction category
    protected function constructTree($mform)
    {
        $mform->addElement('text','numNodes',"Number of Nodes");
        $mform->hideIf('numNodes',"question_category",'neq',"Construct");
    }

    protected function data_preprocessing($question) {
        $question = parent::data_preprocessing($question);
        $question = $this->data_preprocessing_hints($question);

        return $question;
    }

    public function qtype() {
        return 'avl';
    }
}
