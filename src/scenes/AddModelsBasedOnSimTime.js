/*
   Created by: Thongphanh Duangboudda
   Date: March 18, 2019

 */

import {getSimTime} from "../components/UI/DisplayTime";
import AddModels from "./AddModels";
const maxAmountOfTree = 15;
let days = 2;
function AddModelsBasedOnSimTime() {


    const simTime = getSimTime();
   //adding tree every 3 days (simulation time)
    if( simTime.getDay()>= days && parseInt(simTime.getDay()% 3) == 2){
        addTree();
        days = days + 3;
    }

    function addTree(){
       new AddModels("tree");
    }
    function addGras() {
        //TODO: need logic for adding grass

    }
}

export default AddModelsBasedOnSimTime;