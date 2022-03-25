<script lang="ts">
  import {page as _page} from '$app/stores';
  import {goto} from '$app/navigation';
  import {
    fetchList,
    initListResult,
    supabase,
    type FetchList,
    type FetchListResult
  } from '../../supabase';
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let config: FetchList;

  let value: FetchListResult = initListResult(config, $_page.url.searchParams);
  let loading = true;
  let loadingAnimation = true;

  async function fetchItems(url) {
    loading = true;
    const loadingTimeout = setTimeout(() => {
      loadingAnimation = true;
    }, config.loadingAnimationDelay || 200);
    try {
      const res = await fetchList(config, url.searchParams, value);
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
      res.detailSave = item => {
        return () => {
          const key = config.detail?.key || 'id';
          const keyValue = item[key];
          const updateValue = (config.detail?.fields || []).reduce((acc, f) => {
            if (typeof f === 'string') {
              acc[f] = item[f] !== '' ? item[f] : null;
            } else if (f.nullable) {
              acc[f.id] = item[f.id] !== '' ? item[f.id] : null;
            } else {
              acc[f.id] = item[f.id];
            }
            return acc;
          }, {});
          (async () => {
            value.itemsKey = null;
            loading = true;
            const loadingTimeout = setTimeout(() => {
              loadingAnimation = true;
            }, config.loadingAnimationDelay || 200);
            try {
              const {data, error} = await supabase
                .from(config.table)
                .update(updateValue, {returning: 'minimal'})
                .eq(key, keyValue);
              if (error) throw error;
              goto(res.createLink({id: null}));
            } finally {
              loading = false;
              if (loadingTimeout) {
                clearTimeout(loadingTimeout);
              }
              setTimeout(() => {
                if (!loading) {
                  loadingAnimation = false;
                }
              }, 200);
            }
          })();
        };
      };
      res.detailClose = () => {
        goto(res.createLink({id: null}));
      };
      res.newFilter = () => {
        goto(res.createLink({filterIndex: true}));
      };
      res.filterAdd = filter => {
        return () => {
          res.filter.push({
            field: filter.field,
            operand: filter.operand,
            value: filter.value
          });
          filter.index = null;
          filter.field = null;
          filter.operand = null;
          filter.value = null;
          goto(
            res.createLink({
              paging: {page: null},
              filterIndex: false,
              filter: res.filter
            })
          );
        };
      };
      res.filterSave = filter => {
        return () => {
          res.filter[filter.index] = {
            field: filter.field,
            operand: filter.operand,
            value: filter.value
          };
          filter.index = null;
          filter.field = null;
          filter.operand = null;
          filter.value = null;
          goto(
            res.createLink({
              paging: {page: null},
              filterIndex: false,
              filter: res.filter
            })
          );
        };
      };
      res.filterEdit = index => {
        return () => {
          goto(res.createLink({filterIndex: index}));
        };
      };
      res.filterRemove = index => {
        return () => {
          res.filter.splice(index, 1);
          goto(res.createLink({filterIndex: null, filter: res.filter}));
        };
      };
      res.filterClose = () => {
        goto(res.createLink({filterIndex: null}));
      };
      value = res;
      dispatch('change', value);
    } catch (err) {
      console.log({'FETCH-ERROR': {err}});
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
