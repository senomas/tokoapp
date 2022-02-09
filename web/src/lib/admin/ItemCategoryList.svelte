<script lang="ts">
  import {useLocation} from 'svelte-navigator';
  import {parseURLQuery, urlQueryFilter} from '../store';

  import {supabase} from '../supabase';
  import ItemCategoryDetail from './ItemCategoryDetail.svelte';
  import ItemCategoryFilter from './ItemCategoryFilter.svelte';
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
      id: 'parent',
      title: 'Parent',
      sortable: true,
      class: 'w-80'
    },
    {
      id: 'full_name',
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
  $: {
    const loc = $location;
    param = parseURLQuery(loc.search);
    filter = urlQueryFilter(param);
    id = param[primaryKey];
  }

  function onFilter(event) {
    listComp.onFilter(event);
  }

  async function fetchData({orderField, orderAsc, rangeStart, rangeEnd}) {
    let select = supabase
      .from('item_category_views')
      .select('*', {count: 'exact'});
    if (filter.name) {
      select = select.ilike('full_name', `%${filter.name}%`);
    }
    if (filter.parent) {
      select = select.ilike('parent', `%${filter.parent}%`);
    }
    if (filter.description) {
      select = select.ilike('description', `%${filter.description}%`);
    }
    let {data, count, error} = await select
      .order(orderField, {ascending: orderAsc})
      .range(rangeStart, rangeEnd);
    return {data, count, error};
  }
</script>

<List
  bind:this={listComp}
  entity="item_category"
  {fetchData}
  {user}
  {fields}
  {param}
  {primaryKey}
  on:search={e => filterComp.show(e.detail)}
>
  <ItemCategoryFilter
    bind:this={filterComp}
    slot="filter"
    {filter}
    on:filter={onFilter}
  />
  <ItemCategoryDetail
    slot="detail"
    {user}
    {id}
    top={`${param.bottom}px`}
    {primaryKey}
    navigate={(p, q) => listComp.navigate(p, q)}
  />
</List>
