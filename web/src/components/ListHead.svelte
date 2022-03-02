<script lang="ts">
  import {goto} from '$app/navigation';
  import Fa from 'svelte-fa';
  import {
    faSortAmountDownAlt,
    faSortAmountUp,
    faSearch
  } from '@fortawesome/free-solid-svg-icons';

  export let field;
  export let createLink;
  export let paging;
  export let order;
  export let filter;

  const il = Object.keys(field).length - 1;

  function changeSort(field) {
    if (field[field]?.sortable) {
      if (order.field === field) {
        order.asc = !order.asc;
      } else {
        order.field = field;
        order.asc = true;
      }
      paging.page = 1;
      const link = createLink({order, paging});
      goto(link);
    }
  }

  function search(_) {
    const link = createLink({showFilter: true});
    goto(link);
  }
</script>

<thead>
  <tr>
    {#each Object.keys(field) as f, i}
      <td
        class={[field[f]?.class, field[f]?.sortable ? 'cursor-pointer' : null]
          .filter(v => !!v)
          .join(' ')}
        on:click={() => changeSort(f)}
      >
        <div class="w-full flex space-x-1">
          <div class="flex-none pt-0.5">
            {#if order.field === f}
              {#if order.asc}
                <Fa icon={faSortAmountDownAlt} />
              {:else}
                <Fa icon={faSortAmountUp} />
              {/if}
            {/if}
          </div>
          <div class="grow">{f}</div>
          <div class="flex-none pt-0.5">
            {#if i === il}
              <span on:click={e => search(e)}>
                <Fa
                  icon={faSearch}
                  color={Object.keys(filter).length > 0 ? 'red' : null}
                  scale={1.3}
                /></span
              >
            {/if}
          </div>
        </div>
      </td>
    {/each}
  </tr>
</thead>
