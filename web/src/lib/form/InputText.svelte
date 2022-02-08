<script>
  export let loading;
  export let id;
  export let label = id;
  export let value = null;
  export let validate;

  let props = {...$$props};
  delete props.loading;
  delete props.id;
  delete props.label;
  delete props.value;
  delete props.class;
  delete props.validate;
</script>

<div class={`w-full ${$$props.class || ''} px-3 py-1`}>
  <label
    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
    for={`grid-${id}`}>{label}</label
  >
  <input
    class={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
      validate ? 'border-red-500' : 'border-gray-200'
    } rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
    id={`grid-${id}`}
    type="text"
    disabled={loading}
    bind:value
    {...props}
  />
  {#if validate}
    <p class="text-red-500 text-xs italic">{validate}</p>
  {/if}
</div>
