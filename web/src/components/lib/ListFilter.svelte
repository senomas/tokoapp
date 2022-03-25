<script lang="ts">
  import type {FetchListResult} from '../../supabase';

  export let value: FetchListResult;
</script>

<div class="filter">
  {#each value.filter as filter, idx}
    {#if filter.operand === '>'}
      <div class="item">filter 1</div>
    {:else}
      <div on:click={value.filterEdit(idx)} class="item">
        <span class="label text-xs font-semibold mr-2">
          {filter.field}
          {filter.operand}
          {filter.value}
        </span>
        <span on:click|stopPropagation={value.filterRemove(idx)} class="remove">
          &times;
        </span>
      </div>
    {/if}
  {/each}
</div>
