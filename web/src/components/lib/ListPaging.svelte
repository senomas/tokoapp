<script lang="ts">
  import {goto} from '$app/navigation';
  import FilterIcon from '../icons/FilterIcon.svelte';

  export let value: {
    field?: {[k: string]: any};
    order: {field: string; asc: boolean};
    paging: {
      page: number;
      pageSize: number;
      rangeStart: number;
      rangeEnd: number;
    };
    items: any[];
    total: number;
    createLink: (any) => string;
  };

  let pageMax;
  let pmin;
  let pmax;
  let pages = [];
  $: {
    pageMax = Math.floor(
      (value.total + value.paging.pageSize - 1) / value.paging.pageSize
    );
    const pagingSize1 = value.paging.pageSize - 1;
    const pagingSize2 = Math.floor(value.paging.pageSize / 2);
    pmin = Math.max(1, value.paging.page - pagingSize2);
    pmax = Math.min(pageMax, pmin + pagingSize1);
    pmin = Math.max(1, pmax - pagingSize1);
    pages = [];
    for (let p = pmin; p <= pmax; p++) {
      pages.push(p);
    }
  }

  function goPage(p) {
    return () => {
      if (p <= 1) {
        goto(value.createLink({paging: {...value.paging, page: 1}}));
      } else if (p >= pageMax) {
        goto(value.createLink({paging: {...value.paging, page: pageMax}}));
      } else {
        goto(value.createLink({paging: {...value.paging, page: p}}));
      }
    };
  }

  function search() {
    goto(value.createLink({showFilter: true}));
  }

  function createNew() {
    goto(value.createLink({new: true}));
  }
</script>

<div class="relative h-9">
  <div class="absolute top-0 data-list-paging visible md:invisible">
    <div>
      {#if value.total > 0}
        {value.paging?.rangeStart} - {value.paging?.rangeEnd} of {value.total}
      {:else}
        No data
      {/if}
    </div>
    <div class="grow" />
    <div class="pagination">
      <div class="link" on:click={search}><FilterIcon /></div>
      <div class="link" on:click={createNew}>+</div>
      {#if value.total > 0}
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(1)}
        >
          &#x2759;&#x276E;
        </div>
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(pmin - 1)}
        >
          &#x276E;&#x276E;
        </div>
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(value.paging.page - 1)}
        >
          &#x276E;
        </div>

        <div class="link-">{value.paging.page}</div>

        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(value.paging.page + 1)}
        >
          &#x276F;
        </div>
        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(pmax + 1)}
        >
          &#x276F;&#x276F;
        </div>
        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(pageMax)}
        >
          &#x276F;&#x2759;
        </div>
      {/if}
    </div>
  </div>
  <div class="absolute top-0 data-list-paging invisible md:visible">
    <div>
      {#if value.total > 0}
        Showing {value.paging?.rangeStart} to {value.paging?.rangeEnd} of {value.total}
        entries
      {:else}
        No data
      {/if}
    </div>
    <div class="grow" />
    <div class="pagination">
      <div class="link" on:click={search}><FilterIcon /></div>
      <div class="link" on:click={createNew}>+</div>
      {#if value.total > 0}
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(1)}
        >
          &#x2759;&#x276E;
        </div>
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(pmin - 1)}
        >
          &#x276E;&#x276E;
        </div>
        <div
          class={value.paging.page > 1 ? 'link' : 'link-'}
          on:click={goPage(value.paging.page - 1)}
        >
          &#x276E;
        </div>

        {#each pages as p}
          {#if value.paging.page === p}
            <div class="link-">
              {p}
            </div>
          {:else}
            <div class="link" on:click={goPage(p)}>
              {p}
            </div>
          {/if}
        {/each}

        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(value.paging.page + 1)}
        >
          &#x276F;
        </div>
        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(pmax + 1)}
        >
          &#x276F;&#x276F;
        </div>
        <div
          class={value.paging.page < pageMax ? 'link' : 'link-'}
          on:click={goPage(pageMax)}
        >
          &#x276F;&#x2759;
        </div>
      {/if}
    </div>
  </div>
</div>
