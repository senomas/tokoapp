<script lang="ts">
  export let value;

  const pages = [];
  const pageMax = Math.floor(
    (value.total + value.paging.pageSize - 1) / value.paging.pageSize
  );
  const pagingSize1 = value.paging.pageSize - 1;
  const pagingSize2 = Math.floor(value.paging.pageSize / 2);
  let pmin = Math.max(1, value.paging.page - pagingSize2);
  const pmax = Math.min(pageMax, pmin + pagingSize1);
  pmin = Math.max(1, pmax - pagingSize1);

  if (value.paging.page > 1) {
    pages.push({
      title: '\u2759\u276E',
      link: value.createLink({
        paging: {...value.paging, page: 1}
      })
    });
    pages.push({
      title: '\u276E\u276E',
      link: value.createLink({
        paging: {...value.paging, page: Math.max(1, pmin - 1)}
      })
    });
    pages.push({
      title: '\u276E',
      link: value.createLink({
        paging: {...value.paging, page: value.paging.page - 1}
      })
    });
  } else {
    pages.push({title: '\u2759\u276E'});
    pages.push({title: '\u276E\u276E'});
    pages.push({title: '\u276E'});
  }
  for (let p = pmin; p <= pmax; p++) {
    if (p === value.paging.page) {
      pages.push({title: String(p)});
    } else {
      pages.push({
        title: String(p),
        link: value.createLink({paging: {...value.paging, page: p}})
      });
    }
  }
  if (value.paging.page < pageMax) {
    pages.push({
      title: '\u276F',
      link: value.createLink({
        paging: {...value.paging, page: value.paging.page + 1}
      })
    });
    pages.push({
      title: '\u276F\u276F',
      link: value.createLink({
        paging: {...value.paging, page: Math.min(pageMax, pmax + 1)}
      })
    });
    pages.push({
      title: '\u276F\u2759',
      link: value.createLink({
        paging: {...value.paging, page: pageMax}
      })
    });
  } else {
    pages.push({title: '\u276F'});
    pages.push({title: '\u276F\u276F'});
    pages.push({title: '\u276F\u2759'});
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
    {#each pages as p}
      {#if p.link}
        <a class="px-2 py-2 text-blue-700 cursor-pointer" href={p.link}
          >{p.title}</a
        >
      {:else}
        <span class="px-2 py-2">{p.title}</span>
      {/if}
    {/each}
  </div>
</div>
