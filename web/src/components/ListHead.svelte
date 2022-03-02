<script lang="ts">
  import {goto} from '$app/navigation';
  import SearchIcon from './icons/SearchIcon.svelte';
  import ArrowUpIcon from './icons/ArrowUpIcon.svelte';
  import ArrowDownIcon from './icons/ArrowDownIcon.svelte';

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
          <div class="grow flex">
            <div class="grow" />
            <div>{f}</div>
            <div class="pt-1.5 w-5">
              {#if value.order.field === f}
                {#if value.order.asc}
                  <ArrowUpIcon height={16} />
                {:else}
                  <ArrowDownIcon height={16} />
                {/if}
              {/if}
            </div>
            <div class="grow" />
          </div>
          <div class="flex-none pt-1">
            {#if i === il}
              <span class="search" on:click={e => search(e)}
                ><SearchIcon /></span
              >
            {/if}
          </div>
        </div>
      </td>
    {/each}
  </tr>
</thead>
