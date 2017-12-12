import {Inject} from "../lib/Decorators/Decorators";
import {Injector} from "../lib/Injector/Injector";

class DepC {

    public getHelloMsg() {

        return "hello"
    }
}


@Inject
class DepA {

    constructor(private depC: DepC) {


    }

    public sayHi() {

        let message = this.depC.getHelloMsg();

        console.log(message);
    }
}

class DepB {

    public sayBye() {

        console.log("bye")
    }
}

@Inject
class Test {

    constructor(private depA: DepA, private depB: DepB) {


    }

    public hello() {

        this.depA.sayHi();
        this.depB.sayBye();
    }
}

let injector = new Injector([]);

let test = injector.get(Test);

test.hello();