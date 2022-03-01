<script>
  import {onMount} from 'svelte';

  import {cl} from '../util';

  export let loading = false;
  export let id;
  export let label = id;
  export let model = {};
  export let validate = {};

  let focus = false;
</script>

<div class={cl(['w-full relative my-3', $$props.class])}>
  <input
    class="peer w-full h-10 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 placeholder-transparent"
    {id}
    type="text"
    disabled={loading}
    bind:value={model[id]}
    on:focus={() => (focus = true)}
    on:blur={() => (focus = false)}
    placeholder={label}
  />
  <label
    class="block text-gray-700 text-sm absolute left-0 {model[id] || focus
      ? '-top-3.5'
      : 'top-2'} transition-all"
    for={id}>{label}</label
  >
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
