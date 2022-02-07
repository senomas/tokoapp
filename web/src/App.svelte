<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import { onDestroy } from "svelte";
  import Nav from "./lib/Nav.svelte";
  import Footer from "./lib/Footer.svelte";
  import { User } from "./lib/store";
  import LazyRoute from "./lib/LazyRoute.svelte";
  import Home from "./lib/Home.svelte";

  let user;
  const unUser = User.subscribe((v) => {
    user = v;
    localStorage.setItem("user", JSON.stringify(v));
  });
  onDestroy(unUser);

  const Admin = () => import("./lib/Admin.svelte");
</script>

<Router>
  <main class="max-w mx-auto px-4">
    <div class="pt-4 pb-12">
      <Nav {user} />
      <LazyRoute
        path="admin/*"
        primary={false}
        {user}
        component={Admin}
        delayMs={500}
      >
        Loading Admin...
      </LazyRoute>
      <Route primary={false}>
        <Home />
      </Route>
      <Footer />
    </div>
  </main>
</Router>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
