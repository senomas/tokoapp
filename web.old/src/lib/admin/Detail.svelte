<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {fade} from 'svelte/transition';
  import Confirmation from './Confirmation.svelte';

  const dispatch = createEventDispatcher();

  export let visible;
  export let title;
  export let id;
  export let top = null;
  export let name;
  export let loading = true;
  export let navigate;

  let deleteConfirm;
  let style;

  $: {
    if (top) {
      style = `position: absolute; top: ${top}px; left: 50%; -ms-transform: translate(-50%, 0%); transform: translate(-50%, 0%);`;
    } else {
      style =
        'position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
    }
  }
</script>

{#if visible}
  <div class="veil" />
  <div
    class="border border-gray-500"
    {style}
    in:fade={{duration: 200}}
    out:fade={{duration: 200}}
  >
    <div class="w-full bg-black text-white px-6 py-2">{title}</div>
    <div class="bg-white px-6 py-6">
      <div class="relative w-full flex bg-white dark:bg-gray-500">
        <slot />
        {#if loading}
          <div
            class="w-full h-full absolute top-0 left-0 bg-white dark:bg-gray-500"
            out:fade={{duration: 600}}
          />
        {/if}
      </div>
    </div>
    <div
      class="flex w-full bg-gray-500 justify-center font-bold space-x-2 text-white px-6 py-2"
    >
      <div class="grow" />
      {#if loading}
        <button type="submit" class="btn-primary" disabled>Save</button>
        <button
          class="btn-primary"
          disabled={loading}
          on:click={e => dispatch('reset', e)}>Reset</button
        >
        {#if id && id !== '__NEW__'}
          <button class="btn-primary" disabled>Delete</button>
        {/if}
        <div class="grow text-right">
          <button
            class="btn-primary"
            on:click={() => navigate(null, {id: null})}>Close</button
          >
        </div>
      {:else}
        <button
          type="submit"
          class="btn-primary"
          disabled={loading}
          on:click={e => dispatch('save', e)}>Save</button
        >
        <button
          class="btn-primary"
          disabled={loading}
          on:click={e => dispatch('reset', e)}>Reset</button
        >
        {#if id && id !== '__NEW__'}
          <button
            class="btn-primary"
            disabled={loading}
            on:click={e => deleteConfirm.show(e, () => dispatch('delete', e))}
            >Delete</button
          >
        {/if}
        <div class="grow text-right">
          <button
            class="btn-primary"
            on:click={() => navigate(null, {id: null, bottom: null})}
            >Close</button
          >
        </div>
      {/if}
    </div>
  </div>
{/if}

<Confirmation bind:this={deleteConfirm}
  >Are you sure to<span class="text-red-500 text-bold px-1">DELETE</span
  >"{name || id}" ?</Confirmation
>
