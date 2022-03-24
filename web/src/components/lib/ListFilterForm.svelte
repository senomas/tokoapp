<script lang="ts">
  import type {FetchList, FetchListResult, FilterOperand} from '../../supabase';
  import Input from './Input.svelte';

  export let config: FetchList;
  export let value: FetchListResult;

  let filterIndex = null;
  let form: {index?: number; field?: string; operand?: string; value?: any} =
    {};
  let fields = Object.keys(config.list.filter).map(v => ({key: v, value: v}));
  let operands = [];

  function onChangeField(e) {
    if (form.field && config.list.filter[form.field]) {
      operands = config.list.filter[form.field].map(v => ({key: v, value: v}));
    }
    let found = false;
    for (const {key} of operands) {
      if (key === form.operand) {
        found = true;
        break;
      }
    }
    if (!found) {
      form.operand = null;
    }
    form = form;
  }
  function onChangeOperand(e) {
    console.log({onChangeOperand: {e, form}});
  }

  $: {
    if (value.filterIndex !== filterIndex) {
      if (typeof value.filterIndex === 'number') {
        if (value.filter[value.filterIndex]) {
          form.index = value.filterIndex;
          form.field = value.filter[value.filterIndex].field;
          onChangeField(null);
          form.operand = value.filter[value.filterIndex].operand;
          onChangeOperand(null);
          form.value = value.filter[value.filterIndex].value;
        } else {
          form.index = null;
          form.field = null;
          onChangeField(null);
          form.operand = null;
          onChangeOperand(null);
          form.value = null;
        }
      } else {
        form.index = null;
        form.field = null;
        onChangeField(null);
        form.operand = null;
        onChangeOperand(null);
        form.value = null;
      }
      filterIndex = value.filterIndex;
    }
  }
</script>

{#if value.filterIndex !== false}
  <div class="veil grid sm:content-center border-0">
    <div class="text-white border-0 w-full flex justify-center">
      <div class="text-white border-0 w-full sm:w-[600px] form">
        <div class="header">Add Filter</div>
        <div class="body">
          <Input
            type="select"
            id="field"
            bind:value={form}
            on:change={onChangeField}
            class="w-full"
            options={fields}
          />
          <Input
            type="select"
            id="operand"
            bind:value={form}
            on:change={onChangeOperand}
            class="w-full"
            options={operands}
          />
          <Input type="text" id="value" bind:value={form} class="w-full" />
        </div>
        <div class="footer">
          {#if typeof value.filterIndex === 'number'}
            <button
              id="save"
              class="btn-primary"
              on:click={value.filterSave(form)}>Save</button
            >
          {:else}
            <button
              id="add"
              class="btn-primary"
              on:click={value.filterAdd(form)}>Add</button
            >
          {/if}
          <button id="close" class="btn-cancel" on:click={value.filterClose}
            >Close</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
