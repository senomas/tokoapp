<script lang="ts">
  import {goto} from '$app/navigation';
  import Fa from 'svelte-fa';
  import {
    faSortAmountDownAlt,
    faSortAmountUp,
    faSearch
  } from '@fortawesome/free-solid-svg-icons';

  export let value;

  const il = Object.keys(value.field).length - 1;

  function changeSort(f) {
    if (value.field[f]?.sortable) {
      if (value.order.field === f) {
        value.order.asc = !value.order.asc;
      } else {
        value.order.field = f;
        value.order.asc = true;
      }
      value.paging.page = 1;
      const link = value.createLink({order: value.order, paging: value.paging});
      goto(link);
    }
  }

  function search(_) {
    const link = value.createLink({showFilter: true});
    goto(link);
  }
</script>

<thead>
  <tr>
    {#each Object.keys(value.field) as f, i}
      <td
        class={[
          value.field[f]?.class,
          value.field[f]?.sortable ? 'cursor-pointer' : null
        ]
          .filter(v => !!v)
          .join(' ')}
        on:click={() => changeSort(f)}
      >
        <div class="w-full flex space-x-1">
          <div class="flex-none pt-0.5">
            {#if value.order.field === f}
              {#if value.order.asc}
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
                  color={Object.entries(value.filter).filter(([_, v]) => !!v)
                    .length > 0
                    ? 'red'
                    : null}
                /></span
              >
            {/if}
          </div>
        </div>
      </td>
    {/each}
  </tr>
</thead>
