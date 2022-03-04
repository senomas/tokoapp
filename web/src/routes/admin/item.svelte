<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {goto} from '$app/navigation';
  import {
    fetchData,
    filter_ilike,
    supabase,
    type FetchDataResult
  } from '../../supabase';
  import ListPaging from '../../components/ListPaging.svelte';
  import ListHead from '../../components/ListHead.svelte';
  import ListFilter from '../../components/ListFilter.svelte';
  import Input from '../../components/Input.svelte';
  import ListData from '../../components/ListData.svelte';
  import ListDetail from '../../components/ListDetail.svelte';

  const title = 'Item';
  const table = 'items';
  const detailView = 'item_views';
  const listView = 'item_views';
  const field = {
    id: {label: 'ID', class: 'sm:w-20', sortable: true},
    category: {class: 'sm:w-80', sortable: true},
    name: {class: 'sm:w-[40rem]', sortable: true},
    description: {}
  };

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
        listView,
        detailView,
        detailData: {
          categories: {
            table: 'item_category_views',
            columns: 'id, full_name',
            orderColumn: 'full_name',
            map: data => {
              return data
                ? data.map(v => ({key: v.id, value: v.full_name}))
                : data;
            }
          }
        },
        field,
        filter: {
          category: filter_ilike,
          name: filter_ilike,
          description: filter_ilike
        }
      });
      console.log({fetchItems: {value}});
    } finally {
      loading = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      loadingAnimation = false;
    }
  }

  async function save(_) {
    console.log({save: {item: value.item}});
    const {error} = await supabase
      .from(table)
      .update(
        {
          category_id: value.item.category_id,
          name: value.item.name,
          description: value.item.description
        },
        {returning: 'minimal'}
      )
      .eq('id', value.item.id);
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
  <ListFilter {value}>
    <Input type="text" id="category" bind:value={value.filter} class="w-full" />
    <Input type="text" id="name" bind:value={value.filter} class="w-full" />
    <Input
      type="text"
      id="description"
      bind:value={value.filter}
      class="w-full"
    />
  </ListFilter>
  {#if value.item}
    <ListDetail {value} on:save={save}>
      <Input
        type="select"
        id="category_id"
        tagId="category"
        bind:value={value.item}
        options={value.itemData.categories}
        class="w-full"
      />
      <Input type="text" id="name" bind:value={value.item} class="w-full" />
      <Input
        type="text"
        id="description"
        bind:value={value.item}
        class="w-full"
      />
    </ListDetail>
  {/if}
{/if}
