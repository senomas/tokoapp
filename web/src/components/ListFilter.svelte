<script lang="ts">
  import {goto} from '$app/navigation';
  import {createEventDispatcher} from 'svelte';
  import {fade} from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let showFilter;
  export let createLink;

  let top = '50%';
  let left = '50%';
  let translate =
    '-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';

  function filterReset() {
    const link = createLink({showFilter: false});
    goto(link);
  }
</script>

{#if showFilter}
  <div class="veil" />
  <div
    style="top:{top}; left:{left}; {translate}"
    class="form"
    in:fade={{duration: 100}}
    out:fade={{duration: 100}}
  >
    <div class="header">Filter</div>
    <div class="body">
      <slot />
    </div>
    <div class="footer">
      <button class="btn-primary" on:click={e => dispatch('apply', e)}
        >Apply</button
      >
      <button class="btn-reset" on:click={filterReset}>Reset</button>
    </div>
  </div>
{/if}
