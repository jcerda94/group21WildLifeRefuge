/*
   Created by: Thongphanh Duangboudda
   Date: March 18, 2019

 */

import {getSimTime} from "../components/UI/DisplayTime";
import AddModels from "./AddModels";
const maxAmountOfTree = 15;
let timeInterval = 1;
let days = timeInterval;
function AddModelsBasedOnSimTime() {


    const simTime = getSimTime();
   //adding tree every 1 days (simulation time)
    if( parseInt(simTime.getDay()) >= days && parseInt(simTime.getDay()%(timeInterval)) == 0){
        addTree();
        days = days +timeInterval;
    }

    function addTree(){
       new AddModels("tree");
    }
    function addGras() {
        //TODO: need logic for adding grass

    }
}

export default AddModelsBasedOnSimTime;