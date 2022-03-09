<script lang="ts">
  import {goto} from '$app/navigation';
  import type {FetchDataResult} from 'src/supabase';
  import Input from './Input.svelte';

  export let value: FetchDataResult = null;

  function filterApply() {
    goto(
      value.createLink({
        showFilter: false,
        filter: Object.entries(value.filter as {[k: string]: string}).reduce(
          (acc, [k, v]) => {
            if (v && !!v.trim()) {
              acc[k] = v;
            }
            return acc;
          },
          {}
        )
      })
    );
  }

  function filterReset() {
    const link = value.createLink({showFilter: false, filter: {}});
    goto(link);
  }
</script>

{#if value.showFilter}
  <div class="veil grid sm:content-center border-0">
    <div class="text-white border-0 w-full flex justify-center">
      <div class="text-white border-0 w-full sm:w-[600px] form">
        <div class="header">Filter {value.title || value.table}</div>
        <div class="body">
          {#each Object.entries(value.field) as f}
            {#if f[1].filter && f[1].filter.type === 'select'}
              <Input
                type="select"
                id={f[1].filter.id || f[0]}
                tagId={f[0]}
                bind:value={value.item}
                options={value.itemData[f[1].filter.options || f[0]]}
                class="w-full"
              />
            {:else if f[1].filter !== 'none'}
              <Input
                type="text"
                id={f[0]}
                bind:value={value.filter}
                class="w-full"
              />
            {/if}
          {/each}
        </div>
        <div class="footer">
          <button class="btn-primary" on:click={filterApply}>Apply</button>
          <button class="btn-cancel" on:click={filterReset}>Reset</button>
        </div>
      </div>
    </div>
  </div>
{/if}
