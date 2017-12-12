import {expect} from "chai";
import * as sinon from "sinon";
import {Inject, Provide} from "./Decorators";
import * as annotations from "../Annotations/Annotations";
import {ProvideAnnotation} from "../Annotations/Annotations";

class DependencyOne {}
class DependencyTwo {}

class ProvidedClass {}



describe("Inject", () => {

    const sandbox = sinon.createSandbox();

    after(() => {

        sandbox.restore();

    });

    describe("when a class is decorated with @Inject", () => {

        it("should add correctly instantiated annotation to class", () => {

            let injectAnnotationMock = {};

            sandbox.stub(annotations, "injectAnnotationFactory").value(() => injectAnnotationMock );

            @Inject
            class TestInject {

                constructor(public dependencyOne: DependencyOne, public dependencyTwo: DependencyTwo) {


                }

            }

            expect((<any>TestInject).annotations).to.include(injectAnnotationMock);
            // expect((<any>TestInject).annotations[0]).to.be.instanceof(InjectAnnotation);//have.members([InjectAnnotation]);
            // expect((<any>TestInject).annotations[0].tokens[0]).to.equal(DependencyOne);
            // expect((<any>TestInject).annotations[0].tokens[1]).to.equal(DependencyTwo);

        });

    });

});

describe("Provide", () => {

    describe("when a class is decorated with @Provide called with class argument", () => {

        it("should add correctly instantiated annotation to class", () => {

            @Provide(ProvidedClass)
            class TestProvide {

                constructor() {


                }

            }

            expect((<any>TestProvide).annotations[0]).to.be.instanceof(ProvideAnnotation);

        });

    });

});
