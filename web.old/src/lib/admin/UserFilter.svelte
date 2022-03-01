<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import InputText from '../form/InputText.svelte';
  import Filter from './Filter.svelte';

  const dispatch = createEventDispatcher();

  export let filter: any = {};
  let filterComp;

  export function show(e) {
    filterComp.show(e);
  }

  function onApply() {
    dispatch('filter', filter);
  }

  function onReset() {
    dispatch('filter', {});
  }
</script>

<Filter
  title="Item Filter"
  bind:this={filterComp}
  on:apply={onApply}
  on:reset={onReset}
>
  <div class="flex flex-wrap -mx-3 mb-6">
    <InputText id="email" label="Email" bind:value={filter.email} />
    <InputText id="roles" label="Roles" bind:value={filter.roles} />
  </div>
</Filter>
