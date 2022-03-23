<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {goto} from '$app/navigation';
  import {
    fetchData,
    filter_ilike,
    supabase,
    type FetchDataResult
  } from '../supabase';
  import ListPaging from './lib/ListPaging.svelte';
  import ListHead from './lib/ListHead.svelte';
  import ListFilter from './lib/ListFilter.svelte';
  import ListData from './lib/ListData.svelte';
  import ListDetail from './lib/ListDetail.svelte';

  export let title;
  export let table;
  export let key = null;
  export let detailView = table;
  export let detailData: any = {};
  export let listView = table;
  export let field;

  let value: FetchDataResult = null;
  let loading = true;
  let loadingAnimation = false;

  async function fetchItems(url) {
    loading = true;
    const loadingTimeout = setTimeout(() => {
      loadingAnimation = true;
    }, 200);
    try {
      value = await fetchData({
        title,
        searchParams: url.searchParams,
        table,
        key,
        listView,
        detailView,
        detailData,
        field,
        filter: {
          category: filter_ilike,
          name: filter_ilike,
          description: filter_ilike
        }
      });
    } finally {
      loading = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      loadingAnimation = false;
    }
  }

  async function save(_) {
    const key = value.key || 'id';
    const updateValue = {};
    Object.entries(value.field).forEach(([fk, fv]) => {
      if (fk === key) {
        //skip
      } else if (fv.detail && fv.detail.id) {
        updateValue[fv.detail.id] = value.item[fv.detail.id];
      } else {
        updateValue[fk] = value.item[fk];
      }
    });
    console.log({
      save: {key: {[key]: value.item[key]}, updateValue, item: value.item}
    });
    const {error} = await supabase
      .from(table)
      .update(updateValue, {returning: 'minimal'})
      .eq(key, value.item[key]);
    if (error) throw error;
    const link = value.createLink({id: null, top: null});
    goto(link);
  }

  $: {
    fetchItems($pageStore.url);
  }
</script>

{#if loading}
  <div class="veil-transparent" />
  {#if loadingAnimation}
    LOADING
  {/if}
{/if}
{#if value}
  <table class="data-list">
    <ListHead {value} />
    <tbody>
      {#each value.items as item}
        <ListData {value} {item} />
      {/each}
    </tbody>
  </table>
  <ListPaging {value} />
  <ListFilter bind:value />
  {#if value.item}
    <ListDetail bind:value on:save={save} />
  {/if}
{/if}
