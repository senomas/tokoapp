<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {User} from '../store';
  import {slide} from 'svelte/transition';
  import {goto as _goto} from '$app/navigation';

  export let visible: any = {};
  let timer: any = {};

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

  function goto(href, opts = {}) {
    return () => {
      _goto(href, opts);
    };
  }

  function mouseover(id) {
    return e => {
      if (e.type === 'mouseenter') {
        if (timer[id]) {
          clearTimeout(timer[id]);
          timer[id] = null;
        }
        if (!visible[id]) {
          visible[id] = true;
        }
      } else if (e.type === 'mouseleave') {
        if (timer[id]) {
          clearTimeout(timer[id]);
          timer[id] = null;
        }
        timer[id] = setTimeout(() => {
          visible[id] = false;
        }, 200);
      }
    };
  }
</script>

<ul class="w-full flex space-x-2 justify-between py-1">
  <li>
    <ul class="flex space-x-2">
      <li class="relative bg-gray-500">
        <div
          on:mouseenter={mouseover('menu1')}
          on:mouseleave={mouseover('menu1')}
          class="px-1"
        >
          Menu 1
        </div>
        {#key visible.menu1}
          <ul
            class="{visible.menu1
              ? ''
              : 'hidden'} absolute top-5 left-0 bg-white w-48 py-1 mt-2 px-1 rounded-lg shadow-xl"
            on:mouseenter={mouseover('menu1')}
            on:mouseleave={mouseover('menu1')}
            in:slide
          >
            <li
              class="block px-4 py-1 rounded-md hover:bg-indigo-100"
              on:click={goto('/admin/item')}
            >
              Admin Items
            </li>
          </ul>
        {/key}
      </li>
    </ul>
  </li>
  <li class="relative">
    <button
      on:mouseenter={mouseover('account')}
      on:mouseleave={mouseover('account')}
      class="block h-8 w-8 rounded-full overflow-hidden border-2 border-gray-500"
      ><img
        class="h-full w-full object-cover"
        alt="avatar"
        src="/avatar.svg"
      /></button
    >
    {#key visible.account}
      <ul
        class="{visible.account
          ? ''
          : 'hidden'} absolute top-8 right-0 bg-white w-48 py-1 mt-2 px-1 rounded-lg shadow-xl"
        on:mouseenter={mouseover('account')}
        on:mouseleave={mouseover('account')}
        in:slide
      >
        <li class="block px-4 py-1 rounded-md hover:bg-indigo-100">Account</li>
        <li class="block px-4 py-1 rounded-md hover:bg-indigo-100">Support</li>
        <li
          class="block px-4 py-1 rounded-md hover:bg-indigo-100"
          on:click={logout}
        >
          Sign out
        </li>
      </ul>
    {/key}
  </li>
</ul>
