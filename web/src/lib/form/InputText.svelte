<script>
  import {cl} from '../store';

  export let loading = false;
  export let id;
  export let label = id;
  export let model = {};
  export let validate = {};
</script>

<div class={cl(['w-full relative my-3', $$props.class])}>
  <input
    class="peer w-full h-10 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 placeholder-transparent"
    {id}
    type="text"
    disabled={loading}
    bind:value={model[id]}
    placeholder={label}
  />
  <label
    class="peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
    peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm
    block text-gray-700 text-sm absolute left-0 -top-3.5 transition-all"
    for={id}>{label}</label
  >
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
