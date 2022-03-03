<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {fetchData, filter_ilike, supabase} from '../../supabase';
  import ListPaging from '../../components/ListPaging.svelte';
  import ListHead from '../../components/ListHead.svelte';
  import ListFilter from '../../components/ListFilter.svelte';
  import Input from '../../components/Input.svelte';
  import ListData from '../../components/ListData.svelte';
  import ListDetail from '../../components/ListDetail.svelte';

  const title = 'Item';
  const from = 'items';
  const detailFrom = 'item_views';
  const listFrom = 'item_views';
  const field = {
    id: {label: 'ID', class: 'sm:w-20', sortable: true},
    category: {class: 'sm:w-80', sortable: true},
    name: {class: 'sm:w-[40rem]', sortable: true},
    description: {}
  };

  let value: any = null;
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
        from,
        listFrom,
        detailFrom,
        field,
        filter: {
          category: filter_ilike,
          name: filter_ilike,
          description: filter_ilike
        }
      });
      const {data, error} = await supabase
        .from('item_category_views')
        .select('id, full_name')
        .order('full_name');
      if (error) throw error;
      value.categories = data.map(v => ({key: v.id, value: v.full_name}));
      console.log({fetchItems: {value}});
    } finally {
      loading = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      loadingAnimation = false;
    }
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
    <ListDetail {value}>
      <Input
        type="select"
        id="category_id"
        tagId="category"
        bind:value={value.item}
        options={value.categories}
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
