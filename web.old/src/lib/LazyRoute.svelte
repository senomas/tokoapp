<script lang="ts">
  import {Route} from 'svelte-navigator';
  import Lazy from './Lazy.svelte';

  export let user = null;
  export let component;
  export let delayMs = null;

  let props;
  $: {
    const {component, user, ...restProps} = $$props;
    props = restProps;
  }
</script>

<Route {...props}>
  <Lazy {component} {user} {delayMs}>
    <slot />
  </Lazy>
</Route>
