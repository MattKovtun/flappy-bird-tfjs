import {getRandomInt} from "./utils";

class Agent {
    constructor() {

    }

    performAction(worldState) {
        return getRandomInt(2);

    }


}


export default Agent;