import { Observer } from 'rxjs/Observer';
export interface Notifier {
    notifyIfReady(): boolean;
}
export declare const notify: <T>(promise: PromiseLike<T>, observer: Observer<T>, onReady: (notifier: Notifier) => void) => Notifier;
