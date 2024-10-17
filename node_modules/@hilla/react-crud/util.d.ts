import { type CSSProperties } from 'react';
export type ComponentStyleProps = Readonly<{
    id?: string;
    style?: CSSProperties;
    className?: string;
}>;
export declare function convertToTitleCase(inputString: string): string;
export declare function registerStylesheet(stylesheet: CSSStyleSheet): void;
export declare function featureRegistration<C extends (...args: any[]) => any>(Component: C, feature: string): C;
//# sourceMappingURL=util.d.ts.map