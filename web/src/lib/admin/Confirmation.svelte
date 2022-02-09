<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let title = 'Confirmation';
  let visible = false;
  let confirmCallback;
  let top = '50%';
  let left = '50%';
  let translate =
    '-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';

  export function show(e, cb) {
    const elr = e.srcElement.getBoundingClientRect();
    top = `${Math.max(1, e.y - 50 + window.scrollY)}px`;
    left = `${Math.max(1, e.x - 50 + window.scrollX)}px`;
    translate = '';
    visible = true;
    confirmCallback = cb;
  }

  function confirm() {
    confirmCallback();
    visible = false;
  }
</script>

{#if visible}
  <div class="veil" />
  <div style="position: absolute; top:{top}; left:{left}; {translate}">
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
      <button
        type="submit"
        class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
        on:click={() => confirm()}>Confirm</button
      >
      <div class="grow text-right">
        <button
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
          on:click={() => (visible = false)}>Cancel</button
        >
      </div>
    </div>
  </div>
{/if}
