<script lang="ts">
  import {goto} from '$app/navigation';
  import CarretDownIcon from '../icons/CarretDownIcon.svelte';
  import CarretUpIcon from '../icons/CarretUpIcon.svelte';

  export let value: {
    field?: {[k: string]: any};
    order: {field: string; asc: boolean};
    paging: {page: number};
    items: any[];
    createLink: (any) => string;
  };

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
      {#each Object.entries(value.field) as [f, field]}
        {#if field.list !== 'none'}
          <td on:click={() => changeSort(f)} class={field.class || ''}
            ><div class="flex space-x-1">
              <div class={field.label ? '' : 'fix-case'}>
                {field.label || f}
              </div>
              {#if field.sortable}
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
        {/if}
      {/each}
    </tr>
  {/each}
</thead>
