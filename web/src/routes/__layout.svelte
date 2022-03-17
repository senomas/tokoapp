<script lang="ts">
  import {User} from '../store';
  import {onDestroy, onMount} from 'svelte';
  import '../app.css';
  import LoginForm from '../components/lib/LoginForm.svelte';
  import {supabase} from '../supabase';
  import Sidebar from '../components/lib/Sidebar.svelte';

  let user: any = undefined;

  let unUser;
  onMount(() => {
    unUser = User.subscribe(v => {
      user = v;
      sessionStorage.setItem('user', JSON.stringify(v));
    });
    if (user) {
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
  <Sidebar>
    <slot />
  </Sidebar>
{:else if user === null}
  <LoginForm />
{/if}
