import { Observable } from 'rxjs/Observable';
export { Observable };
export declare const asyncMap: <T, U>(project: (item: T) => PromiseLike<U>, concurrent: number) => (source: Observable<T>) => Observable<U>;
