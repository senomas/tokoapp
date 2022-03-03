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
  {#each value.items as item}
    <tr>
      {#each Object.keys(value.field) as f, i}
        <td on:click={() => changeSort(f)}>{f}</td>
      {/each}
    </tr>
  {/each}
</thead>
