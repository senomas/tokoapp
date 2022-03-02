<script lang="ts">
  import {goto} from '$app/navigation';
  export let value;
  export let item;
  export let line;

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

<tr class={line % 2 === 0 ? 'odd' : 'even'} on:click={e => open(e, item)}>
  {#each Object.keys(value.field) as f}
    <td>{item[f] || ''}</td>
  {/each}
</tr>
