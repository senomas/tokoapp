<script lang="ts">
  import {page as pageStore} from '$app/stores';
  import {slide} from 'svelte/transition';
  import {User} from '../../store';
  import {goto as _goto} from '$app/navigation';
  import DocumentIcon from '../icons/DocumentIcon.svelte';
  import {onMount} from 'svelte';

  let url;
  let pathnames;
  $: {
    url = $pageStore.url.pathname;
    pathnames = [
      '/',
      ...url
        .split('/')
        .filter(v => v && v.length > 0)
        .reduce((acc, _, i, arr) => {
          acc.push(`/${arr.slice(0, i + 1).join('/')}`);
          return acc;
        }, [])
    ];
  }

  export let menus: any[] = [
    {
      icon: '../icons/HomeIcon',
      label: 'Home',
      link: '/'
    },
    {
      icon: '../icons/UserIcon',
      label: 'User',
      link: '/admin/user'
    },
    {
      label: 'Item',
      link: '/admin/item'
    }
  ];
  export let visible: any = {};
  export let labels: any = {};
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

  function goto(href, opts = null, current = null) {
    return () => {
      if (href !== current) {
        visible = {};
        _goto(href, opts || {});
      }
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

  function toggle(id) {
    return () => {
      visible[id] = !visible[id];
    };
  }

  function show(id) {
    return () => {
      visible[id] = true;
    };
  }

  function hide(id) {
    return () => {
      visible[id] = false;
    };
  }

  onMount(async () => {
    for (const menu of menus) {
      if (menu.icon) {
        menu.iconComponent = (
          await import(/* @vite-ignore */ `${menu.icon}.svelte`)
        ).default;
      }
    }
    menus = menus;
  });
</script>

<nav
  class="absolute z-10 select-none bg-indigo-900 text-white h-full min-h-screen transition-all {visible.sidebar
    ? 'w-64'
    : 'hidden sm:block sm:w-14'}"
  on:mouseenter={mouseover('sidebar')}
  on:mouseleave={mouseover('sidebar')}
>
  <ul class="h-full">
    {#if visible.sidebar}
      <li
        class="flex h-[4.5rem] items-center justify-between px-4 space-x-2 hover:bg-indigo-800"
        on:click|preventDefault={hide('sidebar')}
      >
        <span class="font-bold text-2xl sm:text-3xl p-4">Sidebar</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </li>
    {:else}
      <li
        class="flex h-[4.5rem] items-center px-4 space-x-2 hover:bg-indigo-800"
        on:click|preventDefault={show('sidebar')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </li>
    {/if}
    {#each menus as menu}
      <li
        class="relative flex px-4 py-2 space-x-2 {url === menu.link
          ? 'bg-blue-100 hover:bg-blue-100 text-black rounded-l-xl'
          : 'hover:bg-indigo-800 cursor-pointer'}"
        on:click={goto(menu.link, null, url)}
      >
        {#if menu.iconComponent}
          <svelte:component this={menu.iconComponent} />
        {:else}
          <DocumentIcon />
        {/if}
        {#if visible.sidebar}
          <span class="absolute left-10">{menu.label}</span>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
<div class="relative left:0 sm:left-[3.5rem] sm:w-[calc(100%-3.5rem)]">
  <header
    class="z-0 w-full flex items-center bg-gray-700 text-white text-2xl font-bold p-4 select-none"
  >
    <button
      class="p-2 focus:outline-none focus:bg-inherit hover:bg-indigo-800 rounded-md sm:hidden"
      on:click={show('sidebar')}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg></button
    >
    <div class="w-full flex items-center space-x-2 py-1">
      <span
        on:click={goto('/')}
        class="cursor-pointer font-bold hidden sm:block">TokoApp</span
      >
      {#each pathnames as p, pi}
        {#if pi === 1}
          <span class="hidden sm:block">&#x276F;</span>
        {:else if pi > 0}
          <span>&#x276F;</span>
        {/if}
        <span class="relative">
          <div
            on:click={goto(p, null, url)}
            class="{p !== url ? 'cursor-pointer' : ''} font-bold"
          >
            {@html labels[p] || p.split('/').slice(-1)[0]}
          </div>
        </span>
      {/each}
      <span class="flex-grow" />
      <span class="relative text-base">
        <div
          on:mouseenter={mouseover('account')}
          on:mouseleave={mouseover('account')}
          class="block h-8 w-8 rounded-full outline-none overflow-hidden fill-white focus:bg-indigo-800 hover:bg-indigo-800 border-2 border-gray-700 hover:border-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        {#key visible.account}
          <ul
            class="{visible.account
              ? ''
              : 'hidden'} absolute top-8 right-0 bg-white w-48 py-1 mt-2 px-1 rounded-lg shadow-xl font-normal text-black"
            on:mouseenter={mouseover('account')}
            on:mouseleave={mouseover('account')}
            in:slide
          >
            <li class="block px-4 py-1 rounded-md hover:bg-indigo-100">
              Account
            </li>
            <li class="block px-4 py-1 rounded-md hover:bg-indigo-100">
              Support
            </li>
            <li
              class="block px-4 py-1 rounded-md hover:bg-indigo-100"
              on:click={logout}
            >
              Sign out
            </li>
          </ul>
        {/key}
      </span>
    </div>
  </header>
  <div class="sm:p-4">
    <slot />
  </div>
</div>
