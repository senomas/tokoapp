<script lang="ts">
  import {User} from '../store';
  import {onDestroy, onMount} from 'svelte';
  import '../app.css';
  import LoginForm from '../components/LoginForm.svelte';
  import Header from '../components/Header.svelte';
  import {supabase} from '../supabase';

  let user: any = undefined;

  let unUser;
  onMount(() => {
    unUser = User.subscribe(v => {
      user = v;
      sessionStorage.setItem('user', JSON.stringify(v));
    });
    if (user) {
      console.log({checkUser: {user}});
      supabase.auth.api.getUser(user.access_token).then(({error}) => {
        if (error) {
          user = null;
          sessionStorage.clear();
        }
      });
    }
  });

  onDestroy(() => {
    if (unUser) unUser();
  });
</script>

{#if user}
  <Header />
  <slot />
{:else if user === null}
  <LoginForm />
{/if}
