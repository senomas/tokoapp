<script lang="ts">
  import {fade} from 'svelte/transition';
  import {User} from '../store';
  import {supabase} from '../supabase';

  import Input from './Input.svelte';

  let value = {};
  let loading = false;
  let top = '50%';
  let left = '50%';
  let translate =
    '-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';

  async function login() {
    try {
      loading = true;
      const {user: cuser, session, error} = await supabase.auth.signIn(value);
      if (error) throw error;
      User.signin({...session, ...cuser});
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  }
</script>

<div class="veil-full" />
<div
  style="top:{top}; left:{left}; {translate}"
  class="form"
  in:fade={{duration: 100}}
  out:fade={{duration: 100}}
>
  <div class="header">Login</div>
  <div class="body">
    <Input type="text" id="email" bind:value class="w-full" />
    <Input type="password" id="password" bind:value class="w-full" />
  </div>
  <div class="footer">
    <button class="btn-primary" disabled={loading} on:click={login}
      >{loading ? 'Loading' : 'LOGIN'}</button
    >
  </div>
</div>
