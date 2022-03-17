<script lang="ts">
  import {page as _page} from '$app/stores';
  import {goto} from '$app/navigation';
  import {
    fetchList,
    type FetchList,
    type FetchListResult
  } from '../../supabase';

  export let config: FetchList;

  let value: FetchListResult;
  let loading = false;
  let loadingAnimation = false;

  async function fetchItems(url) {
    loading = true;
    const loadingTimeout = setTimeout(() => {
      loadingAnimation = true;
    }, 200);
    try {
      const res = await fetchList(config, url.searchParams);
      if (res.items) {
        for (const item of res.items) {
          item.open = () => {
            goto(res.createLink({id: item.id}));
          };
        }
      }
      res.toggleOrder = (field: string) => {
        return () => {
          if (res.order && res.order.field === field) {
            goto(res.createLink({order: {field, asc: !res.order.asc}}));
          } else {
            goto(res.createLink({order: {field, asc: true}}));
          }
        };
      };
      res.gotoPage = (page: number) => {
        return () => {
          if (
            page >= 1 &&
            page <= res.paging.lastPage &&
            res.paging.page !== page
          ) {
            goto(res.createLink({paging: {page}}));
          }
        };
      };
      res.detailClose = () => {
        goto(res.createLink({id: null}));
      };
      res.showFilter = () => {
        goto(res.createLink({filterVisible: true}));
      };
      res.filterApply = value => {
        return () => {
          console.log(value);
        };
      };
      res.filterReset = () => {
        goto(res.createLink({filterVisible: null, filter: {}}));
      };
      res.filterClose = () => {
        goto(res.createLink({filterVisible: null}));
      };
      value = res;
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
    fetchItems($_page.url);
  }
</script>

{#if value && value.items}
  <slot {value} {loading} {loadingAnimation} />
{/if}
