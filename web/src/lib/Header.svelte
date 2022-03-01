<script>
  import {supabase} from './supabase';
  import {Theme, User} from './store';
  import {onDestroy} from 'svelte';

  export let user;

  let theme;
  let loading = false;
  let email = '';
  let password = '';

  const login = async () => {
    try {
      loading = true;
      const {
        user: cuser,
        session,
        error
      } = await supabase.auth.signIn({
        email,
        password
      });
      if (error) throw error;
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
      sessionStorage.clear();
      location.reload();
    } finally {
      loading = false;
    }
  };

  function toggleTheme() {
    theme.light = !theme.light;
    Theme.set(theme);
  }

  const unTheme = Theme.subscribe(v => {
    theme = v;
    sessionStorage.setItem('theme', JSON.stringify(v));
    if (theme.light) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  });
  onDestroy(unTheme);
</script>

<header class="text-gray-600 body-font dark:text-gray-100">
  <div class="mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a
      class="flex title-font font-medium items-center mb-4 md:mb-0"
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
      <span
        class="mr-5 cursor-pointer"
        href=""
        on:click|preventDefault={toggleTheme}
        >{theme.light ? 'Dark' : 'Light'}</span
      >
      <a class="mr-5" href="/admin/user">User</a>
      <a class="mr-5" href="/admin/item-category">Item Category</a>
      <a class="mr-5" href="/admin/item">Item</a>
      <a class="mr-5" href="about">About</a>
      <div>
        {#if !user}
          <input type="text" bind:value={email} placeholder="email" />
          <input type="password" bind:value={password} placeholder="password" />
          <button class="btn-primary" disabled={loading} on:click={login}
            >{loading ? 'Loading' : 'LOGIN'}</button
          >
        {:else}
          {user.email}
          <button class="btn-primary" disabled={loading} on:click={logout}
            >{loading ? 'Loading' : 'LOGOUT'}</button
          >
        {/if}
      </div>
    </nav>
  </div>
</header>
