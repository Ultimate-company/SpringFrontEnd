import { type ReactElement } from 'react';
export type HeaderFilterProps = Readonly<{
    /**
     * If true, the column can be sorted. This is useful to disable sorting for
     * properties that are not sortable in the backend, or that require excessive processing.
     */
    sortable?: boolean;
    /**
     * If true, the column can be filtered. This is useful to disable filtering for
     * properties that are not sortable in the backend, or that require excessive processing.
     */
    filterable?: boolean;
    /**
     * Placeholder text for the filter input.
     * Only applies to string, number and date/time value filters.
     */
    filterPlaceholder?: string;
    /**
     * Debounce time for the filter input in milliseconds.
     * Only applies to string value filters and number value filters.
     */
    filterDebounceTime?: number;
    /**
     * Minimum length for the filter input.
     * Only applies to string value filters.
     */
    filterMinLength?: number;
}>;
export declare function StringHeaderFilter(): ReactElement;
export declare function NumberHeaderFilter(): ReactElement;
export declare function EnumHeaderFilter(): ReactElement;
export declare function BooleanHeaderFilter(): ReactElement;
export declare function DateHeaderFilter(): ReactElement;
export declare function TimeHeaderFilter(): ReactElement;
export declare function NoHeaderFilter(): ReactElement;
//# sourceMappingURL=header-filter.d.ts.map