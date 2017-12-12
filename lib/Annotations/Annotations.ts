
// TODO: have abstract Annotation w/ has & get? & extend???
export class InjectAnnotation {

    constructor(public tokens: Array<any>) {


    }

}

export function injectAnnotationFactory(args: Array<any>) : InjectAnnotation {

    function F() {

        InjectAnnotation.call(this, args);
    }

    F.prototype = InjectAnnotation.prototype;

    return new F();

}


export class ProvideAnnotation {

    constructor(public token) {


    }

}

export function readAnnotations(fn) {

    // more functional
    let collectedAnnotations = {
        provide: { token: null },
        params: []
    };

    if (fn.annotations && fn.annotations.length) {

        for (let annotation of fn.annotations) {

            if (annotation instanceof InjectAnnotation) {

                annotation.tokens.forEach((token) => {

                    collectedAnnotations.params.push({
                        token: token
                    });

                });
            }

            if (annotation instanceof ProvideAnnotation) {

                collectedAnnotations.provide.token = annotation.token;
            }

        }

    }

    return collectedAnnotations;

}

// function hasAnnotation(fn, annotationClass) {
//
//     if (!fn.annotations || fn.annotations.length === 0) {
//
//         return false;
//     }
//
//     for (var annotation of fn.annotations) {
//
//         if (annotation instanceof annotationClass) {
//
//             return true;
//         }
//     }
//
//     return false;
// }


// Read annotations on a function or class and collect "interesting" metadata:
// function readAnnotations(fn) {
//
//     var collectedAnnotations = {
//
//         // Description of the provided value.
//         provide: { token: null },
//
//         // List of parameter descriptions.
//         // A parameter description is an object with properties:
//         // - token (anything)
//         // - isPromise (boolean)
//         // - isLazy (boolean)
//         params: []
//
//     };
//
//     if (fn.annotations && fn.annotations.length) {
//
//         for (var annotation of fn.annotations) {
//
//             if (annotation instanceof Inject) {
//
//                 annotation.tokens.forEach((token) => {
//
//                     collectedAnnotations.params.push({
//                         token: token
//                     });
//
//                 });
//             }
//
//             if (annotation instanceof Provide) {
//
//                 collectedAnnotations.provide.token = annotation.token;
//             }
//
//         }
//
//     }
//
//     // Read annotations for individual parameters.
//     // if (fn.parameters) {
//     //
//     //     fn.parameters.forEach((param, idx) => {
//     //
//     //         for (var paramAnnotation of param) {
//     //
//     //             // Type annotation.
//     //             if (isFunction(paramAnnotation) && !collectedAnnotations.params[idx]) {
//     //
//     //                 collectedAnnotations.params[idx] = { token: paramAnnotation };
//     //
//     //             } else if (paramAnnotation instanceof Inject) {
//     //
//     //                 collectedAnnotations.params[idx] = { token: paramAnnotation.tokens[0] };
//     //
//     //             }
//     //         }
//     //
//     //     });
//     // }

//     return collectedAnnotations;
//
// }


// export {
//     annotate,
//     hasAnnotation,
//     readAnnotations,
//
//     SuperConstructor,
//     TransientScope,
//     Inject,
//     Provide,
//     ClassProvider,
//     FactoryProvider
// };
