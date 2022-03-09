<script lang="ts">
  import {page as pageStore} from '$app/stores';

  let data;
  let component;

  $: {
    (async () => {
      let data;
      let component;
      const pathname = $pageStore.url.pathname;
      const res = await fetch(
        `/data${pathname === '' || pathname === '/' ? '/index' : pathname}.json`
      );
      if (res.status === 200) {
        data = await res.json();
        component = (await import(`../components/${data.__type}.svelte`))
          .default;
        delete data.__type;
      } else {
        console.log({res});
      }
      return {data, component};
    })().then(v => {
      data = v.data;
      component = v.component;
    });
  }
</script>

{#if component}
  <svelte:component this={component} {...data} />
{/if}
