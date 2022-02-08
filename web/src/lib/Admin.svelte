<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import { config } from "./admin";
  import Lazy from "./Lazy.svelte";
  import { blur } from "svelte/transition";
  import ItemList from "./admin/ItemList.svelte";
  import ItemDetail from "./admin/ItemDetail.svelte";
  import ItemCategoryList from "./admin/ItemCategoryList.svelte";

  export let user;
</script>

<Router>
  <!-- {#if user && user.email} -->
  <Route path="item" let:params>
    <div in:blur={{ duration: 250, delay: 300 }} out:blur={{ duration: 250 }}>
      <ItemList {user} config={config.item} />
    </div>
  </Route>
  <Route path="item/:id" let:params>
    <div in:blur={{ duration: 250, delay: 300 }} out:blur={{ duration: 250 }}>
      <ItemDetail {user} config={config.item} {params} />
    </div>
  </Route>
  <Route path="item-category" let:params>
    <div in:blur={{ duration: 250, delay: 300 }} out:blur={{ duration: 250 }}>
      <ItemCategoryList {user} config={config.item} />
    </div>
  </Route>
  <Route>
    <h1>Unknown path</h1>
  </Route>
  <!-- {/if} -->
</Router>
