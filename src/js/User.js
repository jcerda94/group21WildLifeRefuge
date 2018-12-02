name: "Jonh";
lastName : "Doe";
level : 0;
class User {


    constructor(name, lastName, level){
        this.name = name;
        this.lastName = lastName;
        this.level = level;

    }
    constructor(name, lastName){
        this.name = name;
        this.lastName = lastName;

    }
    constructor(level){
        this.level = level;
    }
    set name(name){
        this.name = name;
    }
    set level(leve){
        this.level;
    }

     get name(){
        return this.name;
    }
    get leve(){
        return this.level;
    }
}

export default User


