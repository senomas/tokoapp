<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import AdminList from "./AdminList.svelte";
  import { config } from "./admin";

  export let user;
</script>

<Router>
  {#if user && user.email}
    <Route path=":entity/:query" let:params>
      <AdminList config={config[params.entity]} entity={params.entity} query={JSON.parse(params.query)} />
    </Route>
    <Route path=":entity" let:params>
      <AdminList config={config[params.entity]} entity={params.entity} query={{}} />
    </Route>
  {/if}
</Router>
