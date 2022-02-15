<script type="ts">
  import {onDestroy, onMount} from 'svelte';

  import {cl} from '../store';

  export let loading;
  export let id;
  export let label = id;
  export let model = {};
  export let options: any[];
  export let validate;

  let value;

  function getValue(id) {
    return options ? options.filter(v => v.id === id)[0]?.name || '' : '';
  }

  function initValue(id, loading) {
    if (!loading) {
      value = getValue(id);
    }
  }

  function select(opt, _) {
    if (opt) {
      value = opt.name;
      model[id] = opt.id;
    } else {
      value = '';
      model[id] = null;
    }
    focus = false;
  }

  let focus = false;

  function onFocus() {
    focus = true;
    value = '';
  }

  function onClick(e) {
    if (e.target.id !== id && focus) {
      focus = false;
      value = getValue(model[id]);
    }
  }

  onMount(() => {
    window.addEventListener('click', onClick);
  });

  onDestroy(() => {
    window.removeEventListener('click', onClick);
  });

  $: {
    initValue(model[id], loading);
  }
</script>

<div class={cl(['w-full relative my-3', $$props.class])}>
  <div class="relative">
    <input
      class="peer w-full h-10 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 placeholder-transparent"
      {id}
      type="text"
      disabled={loading}
      bind:value
      placeholder={label}
      on:focus={onFocus}
    />
    <label
      class="block text-gray-700 text-sm absolute left-0 {model[id] || focus
        ? '-top-3.5'
        : 'top-2'} transition-all"
      for={id}>{label}</label
    >
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
    {#if focus}
      <div
        class="border border-gray-500 rounded bg-white absolute top-11 z-50 w-full"
      >
        <ul>
          <li
            class="hover:bg-gray-300"
            on:click|stopPropagation={e => select(null, e)}
          >
            <span class="px-2" />
          </li>
          {#if options}
            {#each options as opt}
              {#if opt.name.toLowerCase().indexOf(value.toLowerCase()) >= 0}
                <li
                  class="hover:bg-gray-300"
                  on:click|stopPropagation={e => select(opt, e)}
                >
                  <span class="px-2">{opt.name}</span>
                </li>
              {/if}
            {/each}
          {/if}
        </ul>
      </div>
    {/if}
  </div>
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
