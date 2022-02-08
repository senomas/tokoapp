<script lang="ts">
  import List from "./List.svelte";

  export let user;
  export let config;
</script>

<List {user} {config} entity="item_category" />
