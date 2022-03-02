<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {fetchData, filter_ilike} from '../../supabase';
  import ListPaging from '../../components/ListPaging.svelte';
  import ListHead from '../../components/ListHead.svelte';
  import ListFilter from '../../components/ListFilter.svelte';
  import Input from '../../components/Input.svelte';

  const from = 'item_views';
  const field = {
    id: {class: 'w-20', sortable: true},
    category: {class: 'w-80', sortable: true},
    name: {sortable: true},
    description: {class: 'w-100'}
  };

  let paging: any = {};
  let order: any = {};
  let showFilter = false;
  let filter: any = {};
  let items = [];
  let total = 0;
  let loading = true;
  let createLink: (param: any) => string = null;

  console.log({filter});

  async function fetchItems(url) {
    try {
      loading = true;
      const value = await fetchData({
        searchParams: url.searchParams,
        from,
        field,
        filter: {
          name: filter_ilike
        }
      });
      paging = value.paging;
      order = value.order;
      showFilter = value.showFilter;
      filter = value.filter;
      items = value.items;
      total = value.total;
      createLink = value.createLink;
    } finally {
      loading = false;
    }
  }

  function filterApply(event) {
    console.log({filterApply: {event}});
  }

  $: {
    fetchItems($pageStore.url);
  }
</script>

{#if !loading}
  <ListFilter {showFilter} {createLink} on:apply={filterApply}>
    <Input type="text" id="category" bind:value={filter} class="w-full" />
    <Input type="text" id="name" bind:value={filter} class="w-full" />
    <Input type="text" id="description" bind:value={filter} class="w-full" />
  </ListFilter>
  <table class="data-list">
    <ListHead {field} {paging} {order} {filter} {createLink} />
    <tbody>
      {#each items as item, i}
        <tr class={i % 2 === 0 ? 'odd' : 'even'}>
          {#each Object.keys(field) as f}
            <td>{item[f] || ''}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <ListPaging {paging} {createLink} />
{:else}
  <h1>loading data</h1>
{/if}
