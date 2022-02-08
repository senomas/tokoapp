<script>
  export let loading;
  export let id;
  export let label = id;
  export let value = null;
  export let options;
  export let validate;
</script>

<div class={`w-full ${$$props.class || 'md:w-1/2'} px-3 py-1`}>
  <label
    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
    for={`grid-${id}`}>{label}</label
  >
  <div class="relative">
    <select
      class="block appearance-none w-full bg-gray-200 border  ${validate
        ? 'border-red-500'
        : 'border-gray-200'} text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      id="grid-category"
      disabled={loading}
      bind:value
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
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
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
  {#if validate}
    <p class="text-red-500 text-xs italic">{validate}</p>
  {/if}
</div>
