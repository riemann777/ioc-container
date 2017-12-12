import {expect} from "chai";
import * as sinon from "sinon";
import {Injector} from "./Injector";
import {Inject, Provide} from "../Decorators/Decorators";
import {ClassProvider} from "../Provider/Provider";
import {TestCircularDependency} from "./TestCircularDependency";


let injector;


@Inject
export class DependencyB {

    constructor(public testCircularDepndency: TestCircularDependency) {}
}

@Inject
export class DependencyA {

    constructor(public dependencyB: DependencyB) {}
}


describe("Injector", () => {

    describe("when instantiated", () => {

        describe("when passed modules to load", () => {

            it("should load modules correctly", () => {

                class ActualClass {}

                @Provide(ActualClass)
                class MockClass {}

                injector = new Injector([MockClass]);

                expect((<any>injector).providers.get(ActualClass)).to.be.instanceof(ClassProvider);

            });

        });

    });

    describe("when asked to get instance for given ctor", () => {

        const sandbox = sinon.createSandbox();
        let injector, getInstanceSpy;

        class DependencyOne {}
        class DependencyTwo {}

        @Inject
        class TestInjectClass {

        constructor(public dependencyOne: DependencyOne, public dependencyTwo: DependencyTwo) {}

        }

        beforeEach(() => {

            injector =  new Injector([]);
            getInstanceSpy = sandbox.spy(injector, "get");
        });

        afterEach(() => {

            sandbox.restore();

        });


        describe("when not cached", () => {

            it("should create provider with correct class and dependencies", () => {

                let providerFactorySpy = sandbox.spy(Injector.providerFactory, "create");

                injector.get(TestInjectClass);

                expect(providerFactorySpy.calledWith(TestInjectClass, [ {token: DependencyOne}, {token: DependencyTwo} ])).to.equal(true);

            });

            it("should get instances of dependencies", () => {

                injector.get(TestInjectClass);

                expect(getInstanceSpy.calledWith(DependencyOne)).to.equal(true);
                expect(getInstanceSpy.calledWith(DependencyTwo)).to.equal(true);

            });

            it("should ask provider to create instance", () => {

                const testInjectClass = injector.get(TestInjectClass);

                expect(testInjectClass.dependencyOne).to.deep.equal(new DependencyOne());
                expect(testInjectClass.dependencyTwo).to.deep.equal(new DependencyTwo());

            });

        });

        describe("when cached", () => {

            it("should not create new instance", () => {

                injector.get(TestInjectClass);

                expect(getInstanceSpy.callCount).to.equal(3);

                injector.get(TestInjectClass);

                expect(getInstanceSpy.callCount).to.equal(4);
            });

        });

        describe("when there are circular dependencies", () => {

            it("should throw an exception", () => {

                expect(() => {

                    injector.get(TestCircularDependency);

                }).to.throw(Error, "Cannot instantiate cyclic dependency!");

            });

        });

        describe("when given ctor is not valid", () => {

            it("should throw an exception", () => {

                expect(() => {

                    injector.get(null);

                }).to.throw(Error, "Invalid token \"null\" requested!");

            });

        });

   });

});