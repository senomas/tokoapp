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
        .eq('id', result.id)
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

export async function filter_ilike(builder, key, value) {
  builder.ilike(key, `%${value}%`);
}
