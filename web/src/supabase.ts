import type {PostgrestFilterBuilder} from '@supabase/postgrest-js';
import {createClient} from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export interface FetchData {
  title?: string;
  searchParams: URLSearchParams;
  table: string;
  listView?: string;
  detailView?: string;
  key?: string;
  detailData: {
    [k: string]: {
      table: string;
      columns: string[];
      orderColumn?: string;
      ascending?: boolean;
    };
  };
  field: {[k: string]: any};
  filter: {
    [key: string]: (
      builder: PostgrestFilterBuilder<any>,
      key: string,
      value: string
    ) => void;
  };
}

export interface FetchDataResult {
  paging: any;
  order: {
    field: string;
    asc: boolean;
  };
  table: string;
  listView?: string;
  detailView?: string;
  key?: string;
  title: string;
  showFilter: boolean;
  filter: {[k: string]: string};
  field: {[k: string]: any};
  total: number;
  items: any[];
  item: any;
  itemData: {[k: string]: any[]};
  top: number;
  id: string;
  newItem: boolean;
  createLink: (param: any) => string;
}

export async function fetchData({
  title,
  searchParams,
  table,
  key,
  listView,
  detailView,
  detailData,
  field,
  filter
}: FetchData): Promise<FetchDataResult> {
  const result: FetchDataResult = {
    paging: {
      page: parseInt(searchParams.get('p') || '1'),
      pageSize: parseInt(searchParams.get('s') || '10'),
      pagingSize: parseInt(searchParams.get('ps') || '10'),
      rangeStart: null,
      rangeEnd: null
    },
    order: {
      field: searchParams.get('of'),
      asc: !searchParams.has('de')
    },
    table,
    key,
    detailView,
    listView,
    title,
    showFilter: searchParams.has('f'),
    newItem: searchParams.has('new'),
    filter: {} as any,
    field,
    total: null,
    items: null,
    item: null,
    itemData: null,
    top: parseInt(searchParams.get('top') || '0'),
    id: searchParams.get('id'),
    createLink: null
  };

  result.createLink = (p: any) => {
    const param = {...result, ...p};
    const q = [];
    if (param.paging) {
      if (param.paging.page && param.paging.page > 1) {
        q.push(['p', param.paging.page]);
      }
      if (param.paging.pageSize && param.paging.pageSize != 10) {
        q.push(['s', param.paging.pageSize]);
      }
      if (param.paging.pagingSize && param.paging.pagingSize != 10) {
        q.push(['ps', param.paging.pagingSize]);
      }
    }
    if (param.order) {
      if (param.order.field) {
        q.push(['of', param.order.field]);
        if (!param.order.asc) {
          q.push(['de']);
        }
      }
    }
    if (param.showFilter) {
      q.push(['f']);
    }
    if (param.filter) {
      Object.entries(param.filter).forEach(([k, v]) => {
        q.push([`f_${k}`, v]);
      });
    }
    if (param.id) {
      q.push(['id', param.id]);
    }
    if (param.top && param.top > 0) {
      q.push(['top', param.top]);
    }
    return `?${q
      .map(([k, v]) =>
        v
          ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          : encodeURIComponent(k)
      )
      .join('&')}`;
  };

  const builder = supabase
    .from(listView || table)
    .select(Object.keys(field).join(','), {count: 'exact'});
  searchParams.forEach((v, k) => {
    if (k.startsWith('f_')) {
      const fk = k.substring(2);
      result.filter[fk] = v;
      if (filter[fk]) {
        filter[fk](builder, fk, v);
      }
    }
  });
  if (result.order && result.order.field) {
    builder.order(result.order.field, {ascending: result.order.asc});
  }
  const rangeStart = (result.paging.page - 1) * result.paging.pageSize;
  const rangeEnd = rangeStart + result.paging.pageSize - 1;
  const {data, count, error} = await builder.range(rangeStart, rangeEnd);
  if (error) throw error;
  result.items = data;
  result.total = count;
  result.paging.rangeStart = rangeStart + 1;
  result.paging.rangeEnd = Math.min(rangeEnd + 1, count);

  if (result.id) {
    const details = [];
    details.push(
      supabase
        .from(detailView || table)
        .select('*')
        .eq(key || 'id', result.id)
    );
    const ddk = [];
    if (detailData) {
      Object.entries(detailData).forEach(([k, v], i) => {
        ddk.push({k, v, i});
        const q = supabase.from(v.table).select(v.columns.join(', '));
        if (v.orderColumn) {
          q.order(v.orderColumn, {ascending: v.ascending || false});
        }
        details.push(q);
      });
    }
    const dres = await Promise.all(details);
    for (const d of dres) {
      if (d.error) throw d;
    }
    result.item = dres[0].data[0];
    result.itemData = {};
    for (const dk of ddk) {
      const kkey = dk.v.columns[0];
      const kvalue = dk.v.columns[1];
      result.itemData[dk.k] = dres[dk.i + 1].data.map(v => ({
        key: v[kkey],
        value: v[kvalue]
      }));
    }
  }
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return result;
}

export interface FetchList {
  table: string;
  loadingAnimationDelay?: number;
  cache?: number;
  detail?: {
    view: string;
    select: string;
    key?: string;
    fields?: (string | {id: string; nullable: boolean})[];
    options?: {
      [k: string]: {
        table: string;
        key: string;
        value: string;
        order: string;
        asc?: boolean;
      };
    };
  };
  list?: {
    view: string;
    select: string;
    filter: {
      [k: string]: (builder, key, value) => void;
    };
  };
}

export function initListResult(searchParams: URLSearchParams): FetchListResult {
  const result: FetchListResult = {
    paging: {
      page: parseInt(searchParams.get('p') || '1'),
      lastPage: 0,
      pageSize: parseInt(searchParams.get('s') || '10'),
      pagingSize: parseInt(searchParams.get('ps') || '10'),
      rangeStart: null,
      rangeEnd: null,
      pages: []
    },
    order: {
      field: searchParams.get('of') || 'id',
      asc: !searchParams.has('de')
    },
    filterVisible: searchParams.has('f'),
    filter: {},
    total: null,
    timestamp: searchParams.get('ts'),
    itemsKey: null,
    items: [],
    id: searchParams.get('id'),
    item: null,
    createLink: null,
    open: null,
    gotoPage: null,
    toggleOrder: null,
    detailSave: null,
    detailClose: null,
    detailReload: null,
    showFilter: null,
    filterApply: null,
    filterReset: null,
    filterClose: null
  };
  result.createLink = (p: any) => {
    const param = {...result, ...p};
    const q = [];
    if (param.timestamp) {
      q.push(['ts', param.timestamp]);
    }
    if (param.paging) {
      if (param.paging.page && param.paging.page > 1) {
        q.push(['p', param.paging.page]);
      }
      if (param.paging.pageSize && param.paging.pageSize != 10) {
        q.push(['s', param.paging.pageSize]);
      }
      if (param.paging.pagingSize && param.paging.pagingSize != 10) {
        q.push(['ps', param.paging.pagingSize]);
      }
    }
    if (param.order) {
      if (param.order.field) {
        q.push(['of', param.order.field]);
        if (!param.order.asc) {
          q.push(['de']);
        }
      }
    }
    if (param.filterVisible) {
      q.push(['f']);
    }
    if (param.filter) {
      Object.entries(param.filter).forEach(([k, v]) => {
        q.push([`f_${k}`, v]);
      });
    }
    if (param.id) {
      q.push(['id', param.id]);
    }
    if (param.top && param.top > 0) {
      q.push(['top', param.top]);
    }
    return `?${q
      .map(([k, v]) =>
        v
          ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          : encodeURIComponent(k)
      )
      .join('&')}`;
  };
  return result;
}
export interface FetchListResult {
  paging: {
    page: number;
    lastPage: number;
    pageSize: number;
    pagingSize: number;
    rangeStart: number;
    rangeEnd: number;
    pages: number[];
  };
  order: {
    field: string;
    asc: boolean;
  };
  filter: {
    [k: string]: string;
  };
  filterVisible: boolean;
  total: number;
  timestamp: string;
  itemsKey: string;
  items: any[];
  id: string;
  item: any;
  options?: {
    [k: string]: {key; value}[];
  };
  createLink: (param: any) => string;
  open: () => void;
  gotoPage: (page: number) => () => void;
  toggleOrder: (field: string) => () => void;
  detailClose: () => void;
  detailSave: (item: any) => () => void;
  detailReload: () => void;
  showFilter: () => void;
  filterApply: (filter: any) => () => void;
  filterReset: () => void;
  filterClose: () => void;
}

export async function fetchList(
  {table, cache, detail, list}: FetchList,
  searchParams: URLSearchParams,
  previous: FetchListResult
) {
  const result = initListResult(searchParams);
  result.itemsKey = result.createLink({id: null, filterVisible: null});
  const procs = [];
  procs.push(
    (async () => {
      if (result.itemsKey !== previous.itemsKey) {
        const builder = supabase
          .from(list?.view || table)
          .select(list?.select || '*', {count: 'exact'});
        searchParams.forEach((v, k) => {
          if (k.startsWith('f_')) {
            const fk = k.substring(2);
            result.filter[fk] = v;
            if (list?.filter[fk]) {
              list.filter[fk](builder, fk, v);
            }
          }
        });
        if (result.order && result.order.field) {
          builder.order(result.order.field, {ascending: result.order.asc});
        }
        const rangeStart = (result.paging.page - 1) * result.paging.pageSize;
        const rangeEnd = rangeStart + result.paging.pageSize - 1;
        const {data, count, error} = await builder.range(rangeStart, rangeEnd);
        if (error) throw error;
        result.timestamp = String(Math.floor(Date.now() / (cache || 60000)));
        result.items = data.map(v =>
          Object.entries(v).reduce((acc, [k, v]) => {
            acc[k] = v || '';
            return acc;
          }, {})
        );
        result.total = count;
        result.paging.rangeStart = rangeStart + 1;
        result.paging.rangeEnd = Math.min(rangeEnd + 1, count);
        result.paging.lastPage = Math.floor(
          (result.total + result.paging.pageSize - 1) / result.paging.pageSize
        );
      } else {
        result.timestamp = previous.timestamp;
        result.items = previous.items;
        result.total = previous.total;
        result.paging = previous.paging;
      }
      let pmin = Math.max(
        1,
        result.paging.page - Math.floor(result.paging.pagingSize / 2) + 1
      );
      let pmax = Math.min(
        result.paging.lastPage,
        result.paging.page + Math.floor(result.paging.pagingSize / 2) - 1
      );
      pmin = Math.min(pmin, Math.max(1, pmax - result.paging.pageSize + 1));
      pmax = Math.max(
        pmax,
        Math.min(result.paging.lastPage, pmin + result.paging.pageSize - 1)
      );
      result.paging.pages = [];
      for (let p = pmin; p <= pmax; p++) {
        result.paging.pages.push(p);
      }
    })()
  );
  if (result.id) {
    procs.push(
      (async () => {
        const {data, error} = await supabase
          .from(detail?.view || table)
          .select(detail?.select || '*')
          .eq('id', result.id);
        if (error) throw error;
        result.item = data[0];
      })()
    );
    if (detail?.options) {
      result.options = {};
      for (const [ok, opt] of Object.entries(detail.options)) {
        procs.push(
          (async () => {
            const builder = supabase
              .from(opt.table)
              .select(`${opt.key}, ${opt.value}`);
            if (opt.order) {
              builder.order(opt.order, {ascending: !!opt.asc});
            }
            const {data, error} = await builder;
            if (error) throw error;
            result.options[ok] = data.map(v => ({
              key: v[opt.key || 'id'],
              value: v[opt.value || 'value']
            }));
          })()
        );
      }
    }
  }
  await Promise.all(procs);
  return result;
}

export async function filter_ilike(builder, key, value) {
  builder.ilike(key, `%${value}%`);
}
