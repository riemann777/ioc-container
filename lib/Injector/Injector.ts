// import {InjectAnnotation, ProvideAnnotation} from "../Annotations/Annotations";
import {readAnnotations} from "../Annotations/Annotations";
import {ProviderFactory} from "../Provider/Provider";


export class Injector {

    private providers: Map<Function, any> = new Map();
    private cache: Map<Function, Function> = new Map();
    private resolving: Function[] = [];
    public static providerFactory: ProviderFactory = new ProviderFactory();

    constructor(modules: Array<any> = []) {

        this.loadModules(modules);

    }

    public get(ctor) {//<T>(ctor: new () => T): T {

        if (!this.isVaild(ctor)) {

            throw new Error(`Invalid token "${ctor}" requested!${getResolvingMessage(this.resolving, ctor)}`);
        }

        if (this.hasCircularDependency(ctor)) {

            throw new Error(`Cannot instantiate cyclic dependency!${getResolvingMessage(this.resolving, ctor)}`);
        }

        if (this.cache.has(ctor)) {

            return this.cache.get(ctor);
        }

        this.resolving.push(ctor);

        const dependencies = readAnnotations(ctor).params,
            provider = Injector.providerFactory.create(ctor, dependencies),
            args = provider.params.map((param: any) => {

                return this.get(param.token);
            }),
            instance = provider.create(args);//this.createWithDependencies(ctor, args);

        this.cache.set(ctor, instance);
        this.resolving.pop();

        return instance;


        // if (this.shouldUseDefaultProvider(ctor)) {

            // const dependencies = readAnnotations(ctor).params,
            //     provider = Injector.providerFactory.create(ctor, dependencies);

        //     this.providers.set(ctor, provider);
        // }

        // const args = this.providers.get(ctor)
        //
        //     return this.get(param.token);
        // });

        // const instance = this.createWithDependencies(ctor, args);

        // // work out when condition is met?
        // if (!hasAnnotation(ctor, TransientScopeAnnotation)) {
        //
        //     this._cache.set(ctor, instance);
        // }

        // this.resolving.pop();

        // return instance;
    }


    // public instantiate<T>(ctor: new () => T): T {
    //
    //     return new ctor();
    // }

    private loadModules(modules: Function[]): void {

        // TODO: test if each module gets provider created & set for correct token
        modules.forEach((module: any) => {

            if (typeof module !== 'function') {

                throw new Error('Invalid module!');
            }

            const annotations = readAnnotations(module),
                token = annotations.provide.token || module,
                dependencies = annotations.params,
                provider = Injector.providerFactory.create(module, dependencies);

            this.providers.set(token, provider);

        });

    }

    // private createWithDependencies(token, args) {
    //
    //     const provider = this.providers.get(token);
    //
    //     return provider.create(args);

        // let instance,
        //     provider = this.providers.get(token);
        //
        //     try {
        //
        //     instance = provider.create(args);
        //
        // } catch (error) {
        //
        //     let originalMsg = 'ORIGINAL ERROR: ' + error.message;
        //
        //     error.message = `Error during instantiation of ${toString(token)}!${getResolvingMessage(this.resolving, token)}\n${originalMsg}`;
        //
        //     // TODO: throw new error?
        //     throw error;
        // }
        //
        // return instance;

    // }

    private shouldUseDefaultProvider(token) {

        return (typeof token === 'function') && !this.providers.has(token)
    }

    private isVaild(token) {

        return !!token && token !== Injector;
    }

    private hasCircularDependency(ctor) {

        if (!ctor.annotations) {

            return false;
        }

        return ctor.annotations.reduce((includesCircularDep, annotation) => {

            annotation.tokens.forEach((token) => {

                // note: babel resolves circular deps as undefined
                includesCircularDep = token === undefined;

            });

            return includesCircularDep;


        }, false);

    }

}

function getResolvingMessage(resolving, token) {
    // If a token is passed in, add it into the resolving array.
    // We need to check arguments.length because it can be null/undefined.
    if (arguments.length > 1) {

        resolving.push(token);
    }

    if (resolving.length > 1) {

        return ` (${resolving.map(toString).join(' -> ')})`;
    }

    return '';
}

function toString(token) {
    if (typeof token === 'string') {
        return token;
    }

    if (token === undefined || token === null) {
        return '' + token;
    }

    if (token.name) {
        return token.name;
    }

    return token.toString();
}