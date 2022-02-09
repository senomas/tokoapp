<script lang="ts">
  import {Router, Route} from 'svelte-navigator';
  import {onDestroy} from 'svelte';
  import Nav from './lib/Nav.svelte';
  import Footer from './lib/Footer.svelte';
  import {User} from './lib/store';
  import ItemList from './lib/admin/ItemList.svelte';
  import ItemCategoryList from './lib/admin/ItemCategoryList.svelte';
  import Home from './lib/Home.svelte';

  let user;

  const unUser = User.subscribe(v => {
    user = v;
    localStorage.setItem('user', JSON.stringify(v));
  });
  onDestroy(unUser);
</script>

<main class="max-w mx-auto px-4">
  <div class="pt-4 pb-12">
    <Router>
      <Nav {user} />
      <Route path="/" primary={false}>
        <Home />
      </Route>
      <Route path="admin/*" primary={false}>
        <Route path="item" primary={false}>
          <ItemList {user} />
        </Route>
        <Route path="item-category" primary={false}>
          <ItemCategoryList {user} />
        </Route>
      </Route>
      <Route primary={false}>
        <h1>Unknown path</h1>
      </Route>
      <Footer />
    </Router>
  </div>
</main>

<style global lang="postcss">
  .veil {
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
