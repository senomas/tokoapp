<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import AdminList from "./AdminList.svelte";
  import { config } from "./admin";
  import Lazy from "./Lazy.svelte";

  export let user;
</script>

<Router>
  {#if user && user.email}
    <Route path=":entity" let:params>
      <AdminList config={config[params.entity]} entity={params.entity} />
    </Route>
    <Route path=":entity/:id" let:params>
      <Lazy
        component={() =>
          import(/* @vite-ignore */ config[params.entity].detail)}
        {user}
        config={config[params.entity]}
        {params}
        delayMs={200}
      >
        <div>Loading</div>
      </Lazy>
    </Route>
    <Route>
      <h1>Unknown path</h1>
    </Route>
  {/if}
</Router>
