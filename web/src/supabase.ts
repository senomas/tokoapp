import type {PostgrestFilterBuilder} from '@supabase/postgrest-js';
import {createClient} from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

interface FetchData {
  title?: string;
  searchParams: URLSearchParams;
  from: string;
  listFrom?: string;
  detailFrom?: string;
  field: {[k: string]: any};
  filter: {
    [key: string]: (
      builder: PostgrestFilterBuilder<any>,
      key: string,
      value: string
    ) => void;
  };
}

export async function fetchData({
  title,
  searchParams,
  from,
  listFrom,
  detailFrom,
  field,
  filter
}: FetchData) {
  const result = {
    paging: {
      page: parseInt(searchParams.get('p') || '1'),
      pageSize: parseInt(searchParams.get('s') || '10'),
      pagingSize: parseInt(searchParams.get('ps') || '10'),
      rangeStart: null as number,
      rangeEnd: null as number
    },
    order: {
      field: searchParams.get('of'),
      asc: !searchParams.has('de')
    },
    from,
    title,
    showFilter: searchParams.has('f'),
    filter: {} as any,
    field,
    total: null as number,
    items: null as any[],
    item: null as any,
    top: parseInt(searchParams.get('top') || '0'),
    id: searchParams.get('id'),
    createLink: null as (param: any) => string
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
    .from(listFrom || from)
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
    const {data, error} = await supabase
      .from(detailFrom || from)
      .select('*')
      .eq('id', result.id);
    if (error) throw error;
    result.item = data[0];
  }
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return result;
}

export async function filter_ilike(builder, key, value) {
  builder.ilike(key, `%${value}%`);
}
