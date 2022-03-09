<script lang="ts">
  import {goto} from '$app/navigation';
  import type {FetchDataResult} from 'src/supabase';
  import {createEventDispatcher} from 'svelte';
  import Input from './Input.svelte';

  const dispatch = createEventDispatcher();
  export let value: FetchDataResult = null;

  function close() {
    const link = value.createLink({id: null, top: null});
    goto(link);
  }
</script>

<div class="veil grid sm:content-center border-0">
  <div class="text-white border-0 w-full flex justify-center">
    <div class="text-white border-0 w-full sm:w-[600px] form">
      <div class="header">{value.title || value.table}</div>
      <div class="body">
        {#each Object.entries(value.field) as f}
          {#if f[1].detail && f[1].detail.type === 'select'}
            <Input
              type="select"
              id={f[1].detail.id || f[0]}
              tagId={f[0]}
              bind:value={value.item}
              options={value.itemData[f[1].detail.options || f[0]]}
              class="w-full"
            />
          {:else if f[1].detail !== 'none'}
            <Input
              type="text"
              id={f[0]}
              bind:value={value.item}
              class="w-full"
            />
          {/if}
        {/each}
      </div>
      <div class="footer">
        <button class="btn-primary" on:click={e => dispatch('save', e)}
          >Save</button
        >
        <button class="btn-cancel" on:click={close}>Close</button>
      </div>
    </div>
  </div>
</div>
