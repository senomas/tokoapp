<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {loadConfig} from '../store';

  let data;
  let component;

  $: {
    (async () => {
      let data;
      let config;
      const pathname = $pageStore.url.pathname;
      if (pathname.endsWith('/')) {
        config = pathname + 'index.yaml';
      } else {
        config = pathname + '.yaml';
      }
      data = await loadConfig(config);
      console.log(JSON.stringify(data, undefined, 2));
      const component = (await import(`../components/${data.__type}.svelte`))
        .default;
      delete data.__type;
      return {data, component};
    })().then(v => {
      data = v.data;
      component = v.component;
    });
  }
</script>

{#if component}
  {#key component}
    <svelte:component this={component} {...data} />
  {/key}
{/if}
