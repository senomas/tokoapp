<script lang="ts">
  export let navigate;
  export let pageSize;
  export let page;
  export let rangeStart = 0;
  export let rangeEnd = 0;
  export let itemsCount = 0;

  let pages = [];

  $: {
    const pageMax = Math.floor((itemsCount + pageSize - 1) / pageSize);
    const pagingSize1 = pageSize - 1;
    const pagingSize2 = Math.floor(pageSize / 2);
    let pmin = Math.max(1, page - pagingSize2);
    const pmax = Math.min(pageMax, pmin + pagingSize1);
    pmin = Math.max(1, pmax - pagingSize1);
    pages = [];
    pages.push({
      title: '+',
      param: {id: '__NEW__'}
    });
    pages.push({
      title: '\u2759\u276E',
      param: page > 1 ? {p: 1} : undefined
    });
    pages.push({
      title: '\u276E\u276E',
      param: page > 1 ? {p: Math.max(1, pmin - 1)} : undefined
    });
    pages.push({
      title: '\u276E',
      param: page > 1 ? {p: page - 1} : undefined
    });
    for (let p = pmin; p <= pmax; p++) {
      if (p === page) {
        pages.push({title: String(p)});
      } else {
        pages.push({
          title: String(p),
          param: {p}
        });
      }
    }
    pages.push({
      title: '\u276F',
      param: page < pageMax ? {p: page + 1} : undefined
    });
    pages.push({
      title: '\u276F\u276F',
      param: page < pageMax ? {p: Math.min(pageMax, pmax + 1)} : undefined
    });
    pages.push({
      title: '\u276F\u2759',
      param: page < pageMax ? {p: pageMax} : undefined
    });
  }
</script>

<div class="w-full flex">
  <div class="px-2 py-2 text-xs text-left">
    Showing {rangeStart + 1} to {rangeEnd} of {itemsCount}
    entries
  </div>
  <div class="grow px-2 py-2 text-xs text-right font-bold">
    {#each pages as p}
      {#if p.param}
        <span
          class="px-2 py-2 text-blue-700 cursor-pointer"
          on:click={() => navigate(p.link, p.param)}>{p.title}</span
        >
      {:else}
        <span class="px-2 py-2 text-black">{p.title}</span>
      {/if}
    {/each}
  </div>
</div>
