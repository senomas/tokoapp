<script lang="ts">
  import {goto} from '$app/navigation';
  import type {FetchDataResult} from '../../supabase';
  export let value: FetchDataResult;
  export let item;

  function open(item) {
    if (value.detailView) {
      return event => {
        const el = event.srcElement.parentElement;
        const elr = el.getBoundingClientRect();
        goto(
          value.createLink({
            id: item.id,
            top: elr.top + elr.height + window.scrollY
          })
        );
      };
    }
    return null;
  }
</script>

<tr on:click={open(item)}>
  {#each Object.entries(value.field) as [f, field]}
    <td
      class={[field.dataClass, value.detailView ? 'cursor-pointer' : ''].join(
        ' '
      ) || ''}>{@html item[f] || '&nbsp;'}</td
    >
  {/each}
</tr>
