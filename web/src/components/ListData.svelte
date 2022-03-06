<script lang="ts">
  import {goto} from '$app/navigation';
  import type {FetchDataResult} from 'src/supabase';
  export let value: FetchDataResult;
  export let item;

  function open(event, item) {
    const el = event.srcElement.parentElement;
    const elr = el.getBoundingClientRect();
    goto(
      value.createLink({
        id: item.id,
        top: elr.top + elr.height + window.scrollY
      })
    );
  }
</script>

<tr on:click={e => open(e, item)}>
  {#each Object.entries(value.field) as [f, field]}
    <td class={field.dataClass || ''}>{@html item[f] || '&nbsp;'}</td>
  {/each}
</tr>
