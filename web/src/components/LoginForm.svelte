<script lang="ts">
  import {fade} from 'svelte/transition';
  import {User} from '../store';
  import {supabase} from '../supabase';

  import Input from './Input.svelte';

  let value = {};
  let loading = false;

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

<div class="veil grid sm:content-center border-0">
  <div class="text-white border-0 w-full flex justify-center">
    <div class="text-white border-0 w-full sm:w-[600px] form">
      <div class="header">Login</div>
      <div class="body">
        <Input type="text" id="email" bind:value class="w-full" />
        <Input type="password" id="password" bind:value class="w-full" />
      </div>
      <div class="footer">
        <button class="btn-primary" disabled={loading} on:click={login}
          >login</button
        >
      </div>
    </div>
  </div>
</div>
