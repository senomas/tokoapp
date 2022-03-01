<script lang="ts">
  import './app.css';
  import {Router, Route} from 'svelte-navigator';
  import {onDestroy} from 'svelte';

  import Header from './lib/Header.svelte';
  import Footer from './lib/Footer.svelte';
  import {User} from './lib/store';
  import ItemList from './lib/admin/ItemList.svelte';
  import ItemCategoryList from './lib/admin/ItemCategoryList.svelte';
  import Home from './lib/Home.svelte';
  import UserList from './lib/admin/UserList.svelte';

  let user;

  const unUser = User.subscribe(v => {
    user = v;
    sessionStorage.setItem('user', JSON.stringify(v));
  });
  onDestroy(unUser);
</script>

<main class="max-w mx-auto">
  <div>
    <Router>
      <div class="w-full flex-col">
        <div class="bg-gray-200 dark:bg-black dark:text-white">
          <Header {user} />
        </div>
        <div class="flex">
          <div class="px-4 py-4">
            <div
              class="border rounded-full w-8 h-8 bg-gray-500 text-white text-center py-0.5 cursor-pointer hover:bg-blue-500"
            >
              U
            </div>
            <div
              class="border rounded-full w-8 h-8 bg-gray-500 text-white text-center py-0.5 cursor-pointer hover:bg-blue-500"
            >
              IC
            </div>
            <div
              class="border rounded-full w-8 h-8 bg-gray-500 text-white text-center py-0.5 cursor-pointer hover:bg-blue-500"
            >
              I
            </div>
          </div>
          <div>
            <Route path="/" primary={false}>
              <Home />
            </Route>
            <Route path="admin/*" primary={false}>
              <Route path="user" primary={false}>
                <UserList {user} />
              </Route>
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
          </div>
        </div>
      </div>
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
</style>
