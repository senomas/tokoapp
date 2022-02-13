<script>
  import Filter from '../admin/Filter.svelte';
  import {cl} from '../store';

  export let loading;
  export let id;
  export let label = id;
  export let model = {};
  export let options;
  export let validate;

  let focus = false;
</script>

<div class={cl(['w-full relative my-3', $$props.class])}>
  <div class="relative">
    <label
      class="peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
    peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm
    block text-gray-700 text-sm absolute left-0 -top-3.5 transition-all"
      for={id}>{label}</label
    >
    <select
      class="peer w-full h-10 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 placeholder-transparent"
      {id}
      disabled={loading}
      bind:value={model[id]}
      required
    >
      <option value="" />
      {#if options}
        {#each options as opt}
          <option value={opt.id}>{@html opt.name}</option>
        {/each}
      {/if}
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700"
    >
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        ><path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        /></svg
      >
    </div>
  </div>
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
