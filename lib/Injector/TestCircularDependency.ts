import {Inject} from "../Decorators/Decorators";
import {DependencyA} from "./Injector.spec";

@Inject
export class TestCircularDependency {

    constructor(dependencyA: DependencyA) {

    }
}