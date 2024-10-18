import type { GridItemModel } from '@hilla/react-components/Grid.js';
import type { GridColumnElement } from '@hilla/react-components/GridColumn.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import { type JSX } from 'react';
export type RendererOptions<TItem> = {
    item: TItem;
    model: GridItemModel<TItem>;
    original: GridColumnElement<TItem>;
};
export declare function AutoGridIntegerRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridDecimalRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridEnumRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridBooleanRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridDateRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridTimeRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridDateTimeRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridJsonRenderer<TItem>({ item }: RendererOptions<TItem>): JSX.Element;
export declare function AutoGridRowNumberRenderer<TItem>({ model }: RendererOptions<TItem>): JSX.Element;
//# sourceMappingURL=autogrid-renderers.d.ts.map