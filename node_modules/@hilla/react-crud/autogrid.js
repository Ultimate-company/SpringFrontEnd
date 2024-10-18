import { jsx } from "react/jsx-runtime";
import {
  Grid
} from "@hilla/react-components/Grid.js";
import { GridColumn } from "@hilla/react-components/GridColumn.js";
import { GridColumnGroup } from "@hilla/react-components/GridColumnGroup.js";
import {
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
  useState,
  cloneElement
} from "react";
import { ColumnContext } from "./autogrid-column-context.js";
import { getColumnOptions } from "./autogrid-columns.js";
import { AutoGridRowNumberRenderer } from "./autogrid-renderers.js";
import css from "./autogrid.obj.js";
import { HeaderSorter } from "./header-sorter";
import { getDefaultProperties, ModelInfo } from "./model-info.js";
import Direction from "./types/org/springframework/data/domain/Sort/Direction.js";
import { registerStylesheet } from "./util";
registerStylesheet(css);
function createDataProvider(grid, service, filter) {
  let first = true;
  return async (params, callback) => {
    const sort = {
      orders: params.sortOrders.filter((order) => order.direction != null).map((order) => ({
        property: order.path,
        direction: order.direction === "asc" ? Direction.ASC : Direction.DESC,
        ignoreCase: false
      }))
    };
    const pageNumber = params.page;
    const { pageSize } = params;
    const req = {
      pageNumber,
      pageSize,
      sort
    };
    const items = await service.list(req, filter.current);
    let size;
    if (items.length === pageSize) {
      size = (pageNumber + 1) * pageSize + 1;
      const cacheSize = grid._dataProviderController.rootCache.size;
      if (cacheSize !== void 0 && size < cacheSize) {
        size = void 0;
      }
    } else {
      size = pageNumber * pageSize + items.length;
    }
    callback(items, size);
    if (first) {
      first = false;
      setTimeout(() => grid.recalculateColumnWidths(), 0);
    }
  };
}
function addCustomColumns(columns, options) {
  if (!options.customColumns) {
    return columns;
  }
  const customColumns = options.noHeaderFilters ? options.customColumns : options.customColumns.map((column) => {
    const { header, headerRenderer } = column.props;
    const { key } = column;
    const columnWithoutHeader = cloneElement(column, { header: void 0, headerRenderer: void 0 });
    return /* @__PURE__ */ jsx(GridColumnGroup, { header, headerRenderer, children: columnWithoutHeader }, key);
  });
  if (options.visibleColumns) {
    const columnMap = [...columns, ...customColumns].reduce((map, column) => {
      const { key } = column;
      if (key) {
        map.set(key, column);
      }
      return map;
    }, /* @__PURE__ */ new Map());
    return options.visibleColumns.map((path) => columnMap.get(path)).filter(Boolean);
  }
  return [...columns, ...customColumns];
}
function useColumns(properties, setPropertyFilter, options) {
  const sortableProperties = properties.filter(
    (propertyInfo) => options.columnOptions?.[propertyInfo.name]?.sortable !== false
  );
  const [sortState, setSortState] = useState(
    sortableProperties.length > 0 ? { [sortableProperties[0].name]: { direction: "asc" } } : {}
  );
  let columns = properties.map((propertyInfo) => {
    let column;
    const customColumnOptions = options.columnOptions ? options.columnOptions[propertyInfo.name] : void 0;
    const { headerRenderer, ...columnProps } = getColumnOptions(propertyInfo, customColumnOptions);
    if (!options.noHeaderFilters) {
      column = /* @__PURE__ */ jsx(GridColumnGroup, { headerRenderer: HeaderSorter, children: /* @__PURE__ */ jsx(GridColumn, { path: propertyInfo.name, headerRenderer, ...columnProps }) });
    } else {
      column = /* @__PURE__ */ jsx(GridColumn, { path: propertyInfo.name, headerRenderer: HeaderSorter, ...columnProps });
    }
    return /* @__PURE__ */ jsx(
      ColumnContext.Provider,
      {
        value: {
          propertyInfo,
          setPropertyFilter,
          sortState,
          setSortState,
          customColumnOptions
        },
        children: column
      },
      propertyInfo.name
    );
  });
  columns = addCustomColumns(columns, options);
  if (options.rowNumbers) {
    columns = [
      /* @__PURE__ */ jsx(GridColumn, { width: "4em", flexGrow: 0, renderer: AutoGridRowNumberRenderer }, "rownumbers"),
      ...columns
    ];
  }
  return columns;
}
function AutoGridInner({
  service,
  model,
  itemIdProperty,
  experimentalFilter,
  visibleColumns,
  noHeaderFilters,
  customColumns,
  columnOptions,
  rowNumbers,
  ...gridProps
}, ref) {
  const [internalFilter, setInternalFilter] = useState({ "@type": "and", children: [] });
  const gridRef = useRef(null);
  const dataProviderFilter = useRef(void 0);
  useImperativeHandle(
    ref,
    () => ({
      get grid() {
        return gridRef.current;
      },
      refresh() {
        gridRef.current?.clearCache();
      }
    }),
    []
  );
  const setHeaderPropertyFilter = (propertyFilter) => {
    const filterIndex = internalFilter.children.findIndex(
      (f) => f.propertyId === propertyFilter.propertyId
    );
    let changed = false;
    if (propertyFilter.filterValue === "") {
      if (filterIndex >= 0) {
        internalFilter.children.splice(filterIndex, 1);
        changed = true;
      }
    } else if (filterIndex >= 0) {
      internalFilter.children[filterIndex] = propertyFilter;
      changed = true;
    } else {
      internalFilter.children.push(propertyFilter);
      changed = true;
    }
    if (changed) {
      setInternalFilter({ ...internalFilter });
    }
  };
  const modelInfo = useMemo(() => new ModelInfo(model, itemIdProperty), [model]);
  const properties = visibleColumns ? modelInfo.getProperties(visibleColumns) : getDefaultProperties(modelInfo);
  const children = useColumns(properties, setHeaderPropertyFilter, {
    visibleColumns,
    noHeaderFilters,
    customColumns,
    columnOptions,
    rowNumbers
  });
  useEffect(() => {
    if (noHeaderFilters) {
      setInternalFilter({ "@type": "and", children: [] });
    }
  }, [noHeaderFilters]);
  useEffect(() => {
    const grid = gridRef.current;
    setTimeout(() => {
      grid.dataProvider = createDataProvider(grid, service, dataProviderFilter);
    }, 1);
  }, [model, service]);
  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      dataProviderFilter.current = experimentalFilter ?? internalFilter;
      grid.clearCache();
    }
  }, [experimentalFilter, internalFilter]);
  return /* @__PURE__ */ jsx(Grid, { itemIdPath: modelInfo.idProperty?.name, ...gridProps, ref: gridRef, children });
}
const AutoGrid = forwardRef(AutoGridInner);
export {
  AutoGrid
};
//# sourceMappingURL=autogrid.js.map
