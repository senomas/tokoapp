<script lang="ts">
  import {User} from '../store';
  import {onDestroy, onMount} from 'svelte';
  import '../app.css';
  import LoginForm from '../components/LoginForm.svelte';
  import Header from '../components/Header.svelte';

  let user: any = undefined;

  let unUser;
  onMount(() => {
    unUser = User.subscribe(v => {
      user = v;
      sessionStorage.setItem('user', JSON.stringify(v));
    });
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
