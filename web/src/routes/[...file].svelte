<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {load} from 'js-yaml';

  let data;
  let component;

  $: {
    (async () => {
      let data;
      let component;
      let config;
      const pathname = $pageStore.url.pathname;
      if (pathname.endsWith('/')) {
        config = pathname + 'index.yaml';
      } else {
        config = pathname + '.yaml';
      }
      console.log({config});
      let res = await fetch(config, {headers: {Accept: 'text/yaml'}});
      if (
        res.status === 200 &&
        res.headers.get('content-type') === 'text/yaml'
      ) {
        const text = await res.text();
        data = load(text);
        component = (await import(`../components/${data.__type}.svelte`))
          .default;
        delete data.__type;
      } else {
        config = pathname + '/index.yaml';
        res = await fetch(config, {headers: {Accept: 'text/yaml'}});
        if (
          res.status === 200 &&
          res.headers.get('content-type') === 'text/yaml'
        ) {
          const text = await res.text();
          data = load(text);
          component = (await import(`../components/${data.__type}.svelte`))
            .default;
          delete data.__type;
        }
      }
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
