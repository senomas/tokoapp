<script lang="ts">
  export let contents: any[] = null;

  let components: any[];
  $: {
    if (contents) {
      const comps = [];
      (async () => {
        for (const c of contents) {
          const component = (await import(`../components/${c.__type}.svelte`))
            .default;
          const props = {...c};
          delete props.__type;
          comps.push({component, props});
        }
        return comps;
      })().then(v => (components = v));
    }
  }
</script>

{#if components}
  {#each components as c}
    <svelte:component this={c.component} {...c.props} />
  {/each}
{/if}
