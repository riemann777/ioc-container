import "reflect-metadata";
import {ProvideAnnotation, injectAnnotationFactory as factory} from "../Annotations/Annotations";


export function Inject(targetClass) : void {

    const dependencies: Array<any> = Reflect.getMetadata("design:paramtypes", targetClass) || [],
        injectAnnotation = factory(dependencies);

    targetClass.annotations = targetClass.annotations || [];
    targetClass.annotations.push(injectAnnotation);

}

export function Provide(providedClass) {

    return function decorator(targetClass) {

        const provideAnnotation = new ProvideAnnotation(providedClass);

        targetClass.annotations = targetClass.annotations || [];
        targetClass.annotations.push(provideAnnotation);

    };

}