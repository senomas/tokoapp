<script lang="ts">
  import {goto} from '$app/navigation';
  import CarretDownIcon from './icons/CarretDownIcon.svelte';
  import CarretUpIcon from './icons/CarretUpIcon.svelte';

  export let value;

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
</script>

<thead>
  {#each value.items as _}
    <tr>
      {#each Object.keys(value.field) as f}
        <td on:click={() => changeSort(f)} class={value.field[f].class || ''}
          ><div class="flex space-x-1">
            <div>{f}</div>
            {#if value.field[f].sortable}
              <div class="relative">
                <div class="absolute left-0">
                  <CarretUpIcon
                    class={value.order.field === f && !value.order.asc
                      ? 'active'
                      : 'inactive'}
                  />
                </div>
                <div class="absolute left-0 top-2">
                  <CarretDownIcon
                    class={value.order.field === f && value.order.asc
                      ? 'active'
                      : 'inactive'}
                  />
                </div>
              </div>
            {/if}
          </div></td
        >
      {/each}
    </tr>
  {/each}
</thead>
