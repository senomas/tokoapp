<script>
  import {useNavigate} from 'svelte-navigator';

  const navigate = useNavigate();

  export let config;
  export let params;
  export let loading;
  export let saveData;
  export let deleteData;
</script>

<div class="w-full border boder-gray-500">
  <div class="w-full bg-black text-white px-6 py-2 text-xl font-bold">
    {params.id === '--NEW--'
      ? `New ${config.name}`
      : `${config.name} ${params.id}`}
    {loading}
  </div>
  <form class="w-full px-6 p-4">
    <slot />
  </form>
  <div
    class="w-full flex justify-center text-white px-6 pt-6 pb-4 font-bold space-x-2"
  >
    <div class="grow" />
    {#if loading}
      <button
        type="submit"
        class="flex-shrink-0 bg-gray-500 hover:bg-gray-700 border-gray-500 hover:border-gray-700 text-sm border-2 text-white py-1 px-5 rounded"
        disabled>Save</button
      >
      {#if params.id !== '--NEW--'}
        <button
          class="flex-shrink-0 bg-red-500 hover:bg-red-200 border-red-200 hover:border-red-200 text-sm border-2 text-white py-1 px-5 rounded"
          disabled>Delete</button
        >
      {/if}
      <div class="grow text-right">
        <button
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
          on:click={() => navigate(-1)}>Back</button
        >
      </div>
    {:else}
      <button
        type="submit"
        class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
        disabled={loading}
        on:click={saveData}>Save</button
      >
      {#if params.id !== '--NEW--'}
        <button
          class="flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-2 text-white py-1 px-5 rounded"
          disabled={loading}
          on:click={deleteData}>Delete</button
        >
      {/if}
      <div class="grow text-right">
        <button
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-2 text-white py-1 px-5 rounded"
          on:click={() => navigate(-1)}>Back</button
        >
      </div>
    {/if}
  </div>
</div>
