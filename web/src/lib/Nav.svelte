<script>
  import {Link} from 'svelte-navigator';
  import {supabase} from './supabase';
  import {User} from './store';

  export let user;

  let loading = false;
  let email = '';
  let password = '';

  const login = async () => {
    try {
      loading = true;
      // const {
      //   user: cuser,
      //   session,
      //   error,
      // } = await supabase.auth.signUp({
      //   email,
      //   password,
      // });
      const {
        user: cuser,
        session,
        error
      } = await supabase.auth.signIn({
        email,
        password
      });
      if (error) throw error;
      console.log({cuser, session, error});
      User.signin({...session, ...cuser});
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };
  const logout = async () => {
    try {
      loading = true;
      User.signout();
      localStorage.clear();
      location.reload();
    } finally {
      loading = false;
    }
  };
</script>

<header class="text-gray-600 body-font">
  <div
    class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
  >
    <a
      class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
      href="/"
      on:click={() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }}
    >
      <h2 class="ml-3 text-xl">ABC</h2>
    </a>
    <nav class="md:mx-auto flex flex-wrap items-center justify-center">
      <Link class="mr-5" to="/Home">Home</Link>
      <Link class="mr-5" to="/admin/item-category">Item Category</Link>
      <Link class="mr-5" to="/admin/item">Item</Link>
      <Link class="mr-5" to="about">About</Link>
      <div>
        {#if !user}
          <input
            type="text"
            bind:value={email}
            placeholder="email"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
          <input
            type="password"
            bind:value={password}
            placeholder="password"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg w-full sm:w-auto px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
            on:click={login}>{loading ? 'Loading' : 'LOGIN'}</button
          >
        {:else}
          {user.email}
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg w-full sm:w-auto px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
            on:click={logout}>{loading ? 'Loading' : 'LOGOUT'}</button
          >
        {/if}
      </div>
    </nav>
  </div>
</header>
