import {Inject, Provide} from "../lib/Decorators/Decorators";
import {Injector} from "../lib/Injector/Injector";

class DepC {

    public getHelloMsg() {

        return "hello";
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

@Provide(DepA)
class DepAMock {

    public sayHi() {

        console.log("MOCK HI!")
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

let injector = new Injector([DepAMock]);

let testing: Test = injector.get(Test);

testing.hello();

// class DepA {}
//
// class Factory {
//
//     public create<A>(ctor: new(dependency) => A, dep: DepA): A {
//
//         return new ctor(dep);
//     }
// }
//
//
// class Car {
//
//
//     constructor(private depA: DepA) {
//
//     }
// }
//
// let factory = new Factory();
//
// let car: Car = factory.create(Car, new DepA());
//
// console.log(car instanceof Car);