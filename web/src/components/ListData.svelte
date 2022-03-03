<script lang="ts">
  import {goto} from '$app/navigation';
  export let value;
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
  {#each Object.keys(value.field) as f}
    <td>{@html item[f] || '&nbsp;'}</td>
  {/each}
</tr>
