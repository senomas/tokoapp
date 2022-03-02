<script lang="ts">
  export let paging;
  export let createLink;

  const pages = [];
  const pageMax = Math.floor(
    (paging.total + paging.pageSize - 1) / paging.pageSize
  );
  const pagingSize1 = paging.pageSize - 1;
  const pagingSize2 = Math.floor(paging.pageSize / 2);
  let pmin = Math.max(1, paging.page - pagingSize2);
  const pmax = Math.min(pageMax, pmin + pagingSize1);

  if (paging.page > 1) {
    pages.push({
      title: '\u2759\u276E',
      link: createLink({
        page: 1
      })
    });
    pages.push({
      title: '\u276E\u276E',
      link: createLink({
        paging: {...paging, page: 1}
      })
    });
    pages.push({
      title: '\u276E',
      link: createLink({
        paging: {...paging, page: 1}
      })
    });
  } else {
    pages.push({title: '\u2759\u276E'});
    pages.push({title: '\u276E\u276E'});
    pages.push({title: '\u276E'});
  }
  for (let p = pmin; p <= pmax; p++) {
    if (p === paging.page) {
      pages.push({title: String(p)});
    } else {
      pages.push({
        title: String(p),
        link: createLink({paging: {...paging, page: p}})
      });
    }
  }
  if (paging.page < pageMax) {
    pages.push({
      title: '\u276F',
      link: createLink({
        paging: {...paging, page: paging.page + 1}
      })
    });
    pages.push({
      title: '\u276F\u276F',
      link: createLink({
        paging: {...paging, page: 1}
      })
    });
    pages.push({
      title: '\u276F\u2759',
      link: createLink({
        paging: {...paging, page: pageMax}
      })
    });
  } else {
    pages.push({title: '\u276F'});
    pages.push({title: '\u276F\u276F'});
    pages.push({title: '\u276F\u2759'});
  }
</script>

<div>
  {paging?.rangeStart} - {paging?.rangeEnd} of {paging?.total}
</div>
<div>
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
