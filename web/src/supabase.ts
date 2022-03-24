import {createClient} from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export type FilterOperand =
  | 'null'
  | '!null'
  | 'contains'
  | '!contains'
  | '='
  | '!='
  | '<'
  | '>'
  | '>='
  | '<=';

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
      [field: string]: FilterOperand[];
    };
  };
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
    field: string;
    operand: FilterOperand;
    value: any;
  }[];
  filterIndex: number | boolean;
  total: number;
  timestamp: string;
  itemsKey: string;
  items: any[];
  id: string;
  item: any;
  options: {
    [k: string]: {key; value}[];
  };
  createLink: (param: any) => string;
  open: () => void;
  gotoPage: (page: number) => () => void;
  toggleOrder: (field: string) => () => void;
  detailClose: () => void;
  detailSave: (item: any) => () => void;
  detailReload: () => void;
  newFilter: () => void;
  filterAdd: (filter: any) => () => void;
  filterSave: (filter: any) => () => void;
  filterEdit: (index: number) => () => void;
  filterRemove: (index: number) => () => void;
  filterClose: () => void;
}

export function initListResult(
  {list}: FetchList,
  searchParams: URLSearchParams
): FetchListResult {
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
    filterIndex: false,
    filter: [],
    total: null,
    timestamp: searchParams.get('ts'),
    itemsKey: null,
    items: [],
    options: {},
    id: searchParams.get('id'),
    item: null,
    createLink: null,
    open: null,
    gotoPage: null,
    toggleOrder: null,
    detailSave: null,
    detailClose: null,
    detailReload: null,
    newFilter: null,
    filterEdit: null,
    filterAdd: null,
    filterSave: null,
    filterRemove: null,
    filterClose: null
  };
  if (searchParams.has('f')) {
    const f = searchParams.get('f');
    if (f === '') {
      result.filterIndex = true;
    } else if (f === 'false') {
      result.filterIndex = false;
    } else {
      result.filterIndex = parseInt(f);
    }
  } else {
    result.filterIndex = false;
  }
  if (searchParams.has('fv')) {
    JSON.parse(searchParams.get('fv')).forEach(v => {
      if (list.filter[v.f] && list.filter[v.f].indexOf(v.o) >= 0) {
        result.filter.push({
          field: v.f,
          operand: v.o,
          value: v.v
        });
      }
    });
  }
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
    if (param.filterIndex === true) {
      q.push(['f']);
    } else if (param.filterIndex !== null && param.filterIndex !== false) {
      q.push(['f', String(param.filterIndex)]);
    }
    if (param.filter) {
      q.push([
        'fv',
        JSON.stringify(
          param.filter.map(v => ({f: v.field, o: v.operand, v: v.value}))
        )
      ]);
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
export async function fetchList(
  {table, cache, detail, list}: FetchList,
  searchParams: URLSearchParams,
  previous: FetchListResult
) {
  const result = initListResult({table, cache, detail, list}, searchParams);
  result.itemsKey = result.createLink({id: null, filterVisible: null});
  const procs = [];
  procs.push(
    (async () => {
      if (result.itemsKey !== previous.itemsKey) {
        const builder = supabase
          .from(list?.view || table)
          .select(list?.select || '*', {count: 'exact'});
        result.filter.forEach(f => {
          if (f.operand === 'contains') {
            builder.ilike(f.field, `%${f.value}%`);
          } else if (f.operand === '!contains') {
            builder.not(f.field, 'ilike', `%${f.value}%`);
          } else if (f.operand === '=') {
            builder.eq(f.field, f.value);
          } else {
            console.log({unsupportedFilter: {f}});
          }
        });
        if (result.order && result.order.field) {
          builder.order(result.order.field, {ascending: result.order.asc});
          if (result.order.field !== 'id') {
            builder.order('id', {ascending: result.order.asc});
          }
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
