<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {useNavigate, useLocation} from 'svelte-navigator';
  import {parseURLQuery, urlQueryFilter} from '../util';
  import ListHeader from './ListHeader.svelte';
  import ListPagination from './ListPagination.svelte';

  export let user;
  export let entity;
  export let param: any = {};
  export let fields = [];
  export let pageSize = 10;
  export let primaryKey = 'id';
  export let allowCreate = true;
  export let fetchData: ({}) => Promise<{data; count; error}>;
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = createEventDispatcher();

  let loading = false;
  let fallback = false;
  let items = [];
  let itemsCount = -1;
  let page: number;
  let rangeStart: number;
  let rangeEnd: number;
  let filtered;

  export function navigate(pathname, q, clearQ = false) {
    const loc = $location;
    if (!clearQ) {
      q = {...param, ...q};
    }
    const qk = Object.keys(q);
    qk.sort();
    loading = true;
    nav(
      `${pathname || loc.pathname}?${qk
        .filter(k => k.length > 0 && q[k] !== null)
        .map(k => `${k}=${encodeURIComponent(q[k])}`)
        .join('&')}`
    );
  }

  export function onFilter(event) {
    const nq = Object.entries(event.detail || {}).reduce(
      (acc, [k, v]) => {
        if (v) {
          acc[`fi:${k}`] = v;
        }
        return acc;
      },
      Object.entries(param).reduce((acc, [k, v]) => {
        if (!k.startsWith('fi:') && k !== 'p') {
          acc[k] = v;
        }
        return acc;
      }, {})
    );
    navigate(null, nq, true);
  }

  function open(event, item) {
    if (!loading) {
      const el = event.srcElement.parentElement;
      const elr = el.getBoundingClientRect();
      navigate(null, {
        id: item[primaryKey],
        bottom: elr.top + elr.height + window.scrollY
      });
    }
  }

  async function loadData(_, entity, param) {
    loading = true;
    const timeout = setTimeout(() => {
      fallback = true;
    }, 200);
    try {
      pageSize = Math.min(100, param.ps ?? pageSize);
      page = parseInt(param.p ?? 1);
      rangeStart = (page - 1) * pageSize;
      rangeEnd = rangeStart + pageSize - 1;
      const orderField = param.of || primaryKey || 'id';
      const orderAsc = (param.oa ?? 'a') === 'a';
      let {data, count, error} = await fetchData({
        orderField,
        orderAsc,
        rangeStart,
        rangeEnd
      });
      if (error) throw error;
      fields = fields.map(f => {
        if (f.id === orderField) {
          f.sort = orderAsc ? 'a' : 'd';
          f.param = {
            of: f.id,
            oa: orderAsc ? 'd' : 'a'
          };
        } else if (f.sortable) {
          f.sort = null;
          f.param = {
            ...param,
            of: f.id,
            oa: 'a'
          };
        }
        return f;
      });
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      items = data;
      itemsCount = count;
      console.log({items, itemsCount});
    } catch (error) {
      if (error.length === 0) {
        if (page > 1) {
          navigate(null, {p: 1});
          return;
        } else {
          return;
        }
      }
      console.log({error});
    } finally {
      clearTimeout(timeout);
      fallback = false;
      loading = false;
    }
  }

  $: {
    const loc = $location;
    param = parseURLQuery(loc.search);
    if (!param.id) {
      const filter = urlQueryFilter(param);
      filtered = filter && Object.entries(filter).length > 0;
      loadData(user, entity, param);
    } else {
      fallback = false;
      loading = false;
    }
  }
</script>

<div>
  <table class="w-full table-fixed border border-gray-300 dark:border-gray-700">
    <thead class="bg-black text-white dark:bg-gray-900 dark:text-gray-200">
      {#each fields as field, i}
        <ListHeader
          {field}
          {navigate}
          {filtered}
          last={i === fields.length - 1}
          on:search={e => dispatch('search', e.detail)}
        />
      {/each}
    </thead>
    {#if fallback}
      <tbody class="bg-white dark:bg-gray-600 dark:text-gray-200">
        {#each items.length === 0 ? [{}] : items as item, i}
          <tr
            class={`text-center ${
              i % 2 == 1 ? 'bg-gray-50' : ''
            } whitespace-nowrap`}
          >
            <td
              colspan={fields.length}
              class="px-6 py-1 text-sm text-gray-500 border border-gray-300 dark:border-gray-500"
              >Loading...</td
            >
          </tr>
        {/each}
      </tbody>
    {:else}
      <tbody
        class="bg-white dark:bg-gray-600 text-sm text-gray-500 dark:text-gray-200 text-left"
      >
        {#each items as item, i}
          <tr
            id={`list-${item[primaryKey]}`}
            class={`whitespace-nowrap ${
              i % 2 == 1 ? 'bg-gray-100 dark:bg-gray-500' : ''
            }`}
            on:click={e => open(e, item)}
          >
            {#each fields as f}
              <td class="px-6 py-1 border border-gray-300 dark:border-gray-500"
                >{@html f.render ? f.render(item[f.id]) : item[f.id] || ''}</td
              >
            {/each}
          </tr>
        {/each}
      </tbody>
    {/if}
    <tfoot class="bg-gray-300 dark:bg-gray-900 dark:text-gray-400">
      <td colspan={fields.length} class="text-xs">
        <ListPagination
          {allowCreate}
          {pageSize}
          {page}
          {navigate}
          {rangeStart}
          rangeEnd={rangeStart + items.length}
          {itemsCount}
        />
      </td>
    </tfoot>
  </table>
</div>
<slot name="filter" />
<slot name="detail" />
