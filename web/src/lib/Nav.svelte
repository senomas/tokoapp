<script>
  import * as animateScroll from "svelte-scrollto";
  import { Link } from "svelte-navigator";
  import { supabase } from "./supabase";
  import { User } from "./store";

  export let user;
  let loading = false;

  const login = async () => {
    try {
      loading = true;
      const {
        user: cuser,
        session,
        error,
      } = await supabase.auth.signIn({
        email: "agus@senomas.com",
        password: "dodol123",
      });
      if (error) throw error;
      console.log({ cuser, session, error });
      User.signin({ ...session, ...cuser });
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
          behavior: "smooth",
        });
      }}
    >
      <h2 class="ml-3 text-xl">ABC</h2>
    </a>
    <nav class="md:mx-auto flex flex-wrap items-center justify-center">
      <Link class="mr-5" to="/">Home</Link>
      <Link class="mr-5" to="/admin/item-category">Item Category</Link>
      <Link class="mr-5" to="/admin/item">Item</Link>
      <Link class="mr-5" to="about">About</Link>
      <a
        class="mr-5"
        name="navigation"
        on:click={() =>
          animateScroll.scrollTo({
            element: "#home",
            offset: 50,
          })}>Home</a
      >
      <a
        class="mr-5"
        name="navigation"
        on:click={() =>
          animateScroll.scrollTo({
            element: "#services",
            offset: 50,
          })}>Our Services</a
      >
      <a
        class="mr-5"
        name="navigation"
        on:click={() =>
          animateScroll.scrollTo({
            element: "#teams",
            offset: 50,
          })}>Our team</a
      >
      {#if !user}
        <div>
          <button class="bg-blue-600 px-6 py-2 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:shadow-outline" disabled={loading} on:click={login}
            >{loading ? "Loading" : "LOGIN"}</button
          >
        </div>
      {:else}
        <div>
          {user.email}
          <button class="bg-blue-600 px-6 py-2 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:shadow-outline" disabled={loading} on:click={logout}
            >{loading ? "Loading" : "LOGOUT"}</button
          >
        </div>
      {/if}
    </nav>
  </div>
</header>
