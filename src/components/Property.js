
const actionMap = {
    set: (type, value) => {
        //use endpoint "{url}.../setHas{type}" to set the value of the property
    },
    increment: (value) => {
        //use endpoint "{url}.../setHasNumber" to increment the value of the property
    },
    flip: (value) => {
        //use endpoint "{url}.../setHasSwitch" to flip the value of the property
    }
}

class Property {
    constructor(value, type) {
        this.value = value
        this.type = type
        this.actions = {}
    }
    hasAction(action) {
        return this.actions.hasOwnProperty(action)
    }
    performAction(action) {
        if (this.hasAction(action)) {
            return this.actions[action]()
        } else throw console.error(`Action ${action} not found for property type ${this.type}`);
    }
}