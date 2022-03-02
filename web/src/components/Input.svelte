<script lang="ts">
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

  function select(opt, _) {
    value[id] = opt?.key;
  }

  function onFocus() {
    focus = true;
    listOpen = true;
  }

  function onBlur() {
    focus = false;
    listOpen = false;
  }

  $: {
    selectValue =
      type === 'select' && options
        ? options.filter(({key}) => key === value[id])[0]?.value
        : '';
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
  {#if type === 'select' && listOpen}
    <div
      class="border border-gray-500 rounded bg-white absolute top-14 z-50 w-full"
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
            <li
              class="hover:bg-gray-300"
              on:mousedown|stopPropagation={e => select(opt, e)}
            >
              <span class="px-2">{opt.value}</span>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
