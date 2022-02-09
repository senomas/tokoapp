<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faSortAmountDownAlt,
    faSortAmountUp,
    faSearch
  } from '@fortawesome/free-solid-svg-icons';
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let field: any;
  export let last;
  export let navigate;
  export let filtered;
</script>

<td
  class={[
    'py-2 pl-6 pr-3 text-xs text-white border border-gray-500 align-middle',
    field.class || '',
    field.sortable ? 'cursor-pointer' : null
  ]
    .filter(v => v)
    .join(' ')}
  on:click={() => (field.param ? navigate(null, field.param) : null)}
>
  <div class="w-full flex space-x-1">
    <div class="flex-none pt-0.5">
      {#if field.sort === 'a'}
        <Fa icon={faSortAmountDownAlt} />
      {:else if field.sort === 'd'}
        <Fa icon={faSortAmountUp} />
      {/if}
    </div>
    <div class="grow">{field.title}</div>
    <div class="flex-none pt-0.5">
      {#if last}
        <span on:click={e => dispatch('search', e)}>
          <Fa
            icon={faSearch}
            color={filtered ? 'red' : null}
            scale={1.3}
          /></span
        >
      {/if}
    </div>
  </div>
</td>
