<script lang="ts">
  import {useLocation} from 'svelte-navigator';
  import {parseURLQuery, urlQueryFilter} from '../store';

  import {supabase} from '../supabase';
  import ItemDetail from './ItemDetail.svelte';
  import ItemFilter from './ItemFilter.svelte';
  import List from './List.svelte';

  const location = useLocation();

  export let user;

  const primaryKey = 'id';
  let listComp;
  let filterComp;

  let fields = [
    {
      id: 'id',
      title: 'ID',
      sortable: true,
      class: 'w-20'
    },
    {
      id: 'category',
      title: 'Category',
      sortable: true,
      class: 'w-80'
    },
    {
      id: 'name',
      title: 'Name',
      sortable: true
    },
    {
      id: 'description',
      title: 'Description',
      class: 'w-100'
    }
  ];

  let param: any = {};
  let id;
  let filter;
  let top;
  $: {
    const loc = $location;
    param = parseURLQuery(loc.search);
    filter = urlQueryFilter(param);
    id = param[primaryKey];
    top = param.bottom || null;
  }

  function onFilter(event) {
    listComp.onFilter(event);
  }

  async function fetchData({orderField, orderAsc, rangeStart, rangeEnd}) {
    let select = supabase.from('item_views').select('*', {count: 'exact'});
    if (filter.name) {
      select = select.ilike('name', `%${filter.name}%`);
    }
    if (filter.category) {
      select = select.ilike('category', `%${filter.category}%`);
    }
    if (filter.description) {
      select = select.ilike('description', `%${filter.description}%`);
    }
    let {data, count, error} = await select
      .order(orderField, {ascending: orderAsc})
      .range(rangeStart, rangeEnd);
    console.log({data, count, error});
    return {data, count, error};
  }
</script>

<List
  bind:this={listComp}
  entity="item"
  {fetchData}
  {user}
  {fields}
  {param}
  {primaryKey}
  on:search={e => filterComp.show(e.detail)}
>
  <ItemFilter
    bind:this={filterComp}
    slot="filter"
    {filter}
    on:filter={onFilter}
  />
  <ItemDetail
    slot="detail"
    {user}
    {id}
    {top}
    {primaryKey}
    navigate={(p, q) => listComp.navigate(p, q)}
  />
</List>
