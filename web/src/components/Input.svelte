<script lang="ts">
  import {onMount} from 'svelte';

  export let id;
  export let tagId = id;
  export let label = tagId;
  export let value;
  export let disabled = false;
  export let type = 'text';
  export let validate = {};
  export let options: {key: string; value: string}[] = null;

  let focus = false;
  let listOpen = false;
  let selectValue;
  let selectValueLC;

  function select(opt, _) {
    value[id] = opt?.key;
  }

  function onFocus() {
    focus = true;
    listOpen = true;
    if (type === 'select' && options) {
      selectValue = '';
    }
  }

  function onBlur() {
    focus = false;
    listOpen = false;
    if (type === 'select' && options) {
      selectValue = options.filter(({key}) => key === value[id])[0]?.value;
    }
  }

  onMount(() => {
    selectValue =
      type === 'select' && options
        ? options.filter(({key}) => key === value[id])[0]?.value
        : '';
  });

  $: {
    selectValueLC = selectValue?.toLowerCase();
  }
</script>

<div class="relative {$$props.class}">
  {#if type === 'text'}
    <input
      class="peer mt-8"
      id={tagId}
      type="text"
      {disabled}
      bind:value={value[id]}
      on:focus={onFocus}
      on:blur={onBlur}
      placeholder={label}
    />
  {:else if type === 'password'}
    <input
      class="peer mt-8"
      id={tagId}
      type="password"
      {disabled}
      bind:value={value[id]}
      on:focus={onFocus}
      on:blur={onBlur}
      placeholder={label}
    />
  {:else if type === 'select'}
    <input
      class="peer mt-8"
      id={tagId}
      type="text"
      {disabled}
      bind:value={selectValue}
      on:focus={onFocus}
      on:blur={onBlur}
      placeholder={label}
    />
  {:else}
    <h1>TYPE '{type}' NOT SUPPORTED</h1>
  {/if}
  <label
    class="block absolute left-0 {!!value[id] || focus
      ? 'top-[0.8rem]'
      : 'top-[2rem]'} transition-all"
    for={id}>{label}</label
  >
  {#if type === 'select'}
    <div
      class="pointer-events-none absolute top-7 inset-y-0 right-0 flex items-center text-gray-700"
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
    {#if listOpen}
      <div
        class="border border-gray-500 rounded bg-white absolute top-14 z-50 w-full max-h-[15rem] overflow-y-auto"
      >
        <ul>
          <li
            class="hover:bg-gray-300"
            on:mousedown|stopPropagation={e => select(null, e)}
          >
            <span class="px-2" />
          </li>
          {#if options}
            {#each options as opt}
              {#if opt?.value?.toLowerCase().includes(selectValueLC)}
                <li
                  class="hover:bg-gray-300"
                  on:mousedown|stopPropagation={e => select(opt, e)}
                >
                  <span class="px-2">{opt.value}</span>
                </li>
              {/if}
            {/each}
          {/if}
        </ul>
      </div>
    {/if}
  {/if}
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
