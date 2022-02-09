<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Confirmation from './Confirmation.svelte';

  const dispatch = createEventDispatcher();

  export let visible;
  export let title;
  export let id;
  export let top;
  export let name;
  export let loading;

  export let navigate;

  let deleteConfirm;
</script>

{#if visible}
  <div class="veil" />
  <div
    style="position: absolute; top:{top}; left: 50%; -ms-transform: translate(-50%, 0%); transform: translate(-50%, 0%);"
  >
    <div class="w-full bg-black text-white px-6 py-2">{title}</div>
    <div class="bg-white px-6 py-6 border border-gray-500">
      <div class="w-full flex bg-white">
        <slot />
      </div>
    </div>
    <div
      class="flex w-full bg-gray-500 justify-center font-bold space-x-2 text-white px-6 py-2"
    >
      <div class="grow" />
      {#if loading}
        <button
          type="submit"
          class="flex-shrink-0 bg-gray-500 hover:bg-gray-700 border-gray-500 hover:border-gray-700 text-sm border-2 text-white py-1 px-5 rounded"
          disabled>Save</button
        >
        {#if id && id !== '__NEW__'}
          <button
            class="flex-shrink-0 bg-red-500 hover:bg-red-200 border-red-200 hover:border-red-200 text-sm border-2 text-white py-1 px-5 rounded"
            disabled>Delete</button
          >
        {/if}
        <div class="grow text-right">
          <button
            class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
            on:click={() => navigate(null, {id: null})}>Close</button
          >
        </div>
      {:else}
        <button
          type="submit"
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
          disabled={loading}
          on:click={() => dispatch('save', null)}>Save</button
        >
        {#if id && id !== '__NEW__'}
          <button
            class="flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-2 text-white py-1 px-5 rounded"
            disabled={loading}
            on:click={e =>
              deleteConfirm.show(e, () => dispatch('delete', null))}
            >Delete</button
          >
        {/if}
        <div class="grow text-right">
          <button
            class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
            on:click={() => navigate(null, {id: null})}>Close</button
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
