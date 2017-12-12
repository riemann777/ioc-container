

export class ClassProvider {

    public params: Array<Function>;
    private constructors: Array<any>;//Function>;


    constructor(private ctor: Function, params: Array<Function>) {

        this.params = params || [];
        this.constructors = [];
        this.constructors.unshift([ctor, 0, this.params.length - 1]);

    }

    public create(args): any {

        const context = Object.create(this.ctor.prototype),
            constructor = this.createConstructor(0, context, args),
            returnedValue = constructor();

        if (typeof returnedValue === 'function' || typeof returnedValue === 'object') {

            return returnedValue;
        }

        return context;
    }


    private createConstructor(currentConstructorIdx, context, allArguments) {

        let constructorInfo = this.constructors[currentConstructorIdx],
            nextConstructorInfo = this.constructors[currentConstructorIdx + 1],
            argsForCurrentConstructor;

        if (nextConstructorInfo) {

            argsForCurrentConstructor = allArguments
                .slice(constructorInfo[1], nextConstructorInfo[1])
                .concat([this.createConstructor(currentConstructorIdx + 1, context, allArguments)])
                .concat(allArguments.slice(nextConstructorInfo[2] + 1, constructorInfo[2] + 1));

        } else {

            argsForCurrentConstructor = allArguments.slice(constructorInfo[1], constructorInfo[2] + 1);

        }

        return function InjectedAndBoundSuperConstructor() {

            return constructorInfo[0].apply(context, argsForCurrentConstructor);
        };
    }

}

export class ProviderFactory {


    public create(ctor, dependencies) {//: ClassProvider {

        return new ClassProvider(ctor, dependencies);
    }

}

// A bunch of helper functions.

// function isUpperCase(char) {
//     return char.toUpperCase() === char;
// }
//
// function isFunction(value) {
//     return typeof value === 'function';
// }
//
//
// function isObject(value) {
//     return typeof value === 'object';
// }
//
//
// function toString(token) {
//     if (typeof token === 'string') {
//         return token;
//     }
//
//     if (token === undefined || token === null) {
//         return '' + token;
//     }
//
//     if (token.name) {
//         return token.name;
//     }
//
//     return token.toString();
// }
//
// var ownKeys = (Reflect && Reflect.ownKeys ? Reflect.ownKeys : function ownKeys(O) {
//     var keys = Object.getOwnPropertyNames(O);
//     if (Object.getOwnPropertySymbols) return keys.concat(Object.getOwnPropertySymbols(O));
//     return keys;
// });