<script lang="ts">
  import {goto} from '$app/navigation';

  export let value;

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
</script>

<div class="data-list-paging">
  <div class="left">
    {#if value.total > 0}
      Showing {value.paging?.rangeStart} to {value.paging?.rangeEnd} of {value.total}
      entries
    {:else}
      Showing 0 entries
    {/if}
  </div>
  <div class="right">
    <span
      class="px-2 py-2 {value.paging.page > 1 ? 'link' : ''}"
      on:click={goPage(1)}>&#x2759;&#x276E;</span
    >
    <span
      class="px-2 py-2 {value.paging.page > 1 ? 'link' : ''}"
      on:click={goPage(pmin - 1)}>&#x276E;&#x276E;</span
    >
    <span
      class="px-2 py-2 {value.paging.page > 1 ? 'link' : ''}"
      on:click={goPage(value.paging.page - 1)}>&#x276E;</span
    >

    {#each pages as p}
      <span
        class="px-2 py-2 {value.paging.page !== p ? 'link' : ''}"
        on:click={goPage(p)}>{p}</span
      >
    {/each}

    <span
      class="px-2 py-2 {value.paging.page < pageMax ? 'link' : ''}"
      on:click={goPage(value.paging.page + 1)}>&#x276F;</span
    >
    <span
      class="px-2 py-2 {value.paging.page < pageMax ? 'link' : ''}"
      on:click={goPage(pmax + 1)}>&#x276F;&#x276F;</span
    >
    <span
      class="px-2 py-2 {value.paging.page < pageMax ? 'link' : ''}"
      on:click={goPage(pageMax)}>&#x276F;&#x2759;</span
    >
  </div>
</div>
