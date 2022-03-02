<script>
  export let id;
  export let label = id;
  export let value;
  export let disabled = false;
  export let type = 'text';
  export let validate = {};

  let focus = false;
</script>

<div class="relative {$$props.class}">
  {#if type === 'text'}
    <input
      class="peer mt-8"
      {id}
      type="text"
      {disabled}
      bind:value={value[id]}
      on:focus={() => (focus = true)}
      on:blur={() => (focus = false)}
      placeholder={label}
    />
  {:else if type === 'password'}
    <input
      class="peer mt-8"
      {id}
      type="password"
      {disabled}
      bind:value={value[id]}
      on:focus={() => (focus = true)}
      on:blur={() => (focus = false)}
      placeholder={label}
    />
  {:else}
    <h1>TYPE '{type}' NOT SUPPORTED</h1>
  {/if}
  <label
    class="block absolute left-0 {value || focus
      ? 'top-[0.8rem]'
      : 'top-[2rem]'} transition-all"
    for={id}>{label}</label
  >
  {#if validate[id]}
    <p class="text-red-500 text-xs italic">{validate[id]}</p>
  {/if}
</div>
