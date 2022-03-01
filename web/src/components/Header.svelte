<script lang="ts">
  import {User} from '../store';

  let loading = false;

  async function logout() {
    try {
      loading = true;
      User.signout();
      sessionStorage.clear();
      location.reload();
    } finally {
      loading = false;
    }
  }
</script>

<div class="W-full flex space-x-3">
  <span>HEADER</span>
  <span class="cursor-pointer" on:click={logout}>logout</span>
</div>
