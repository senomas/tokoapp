<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faSortAmountDownAlt,
    faSortAmountUp,
  } from "@fortawesome/free-solid-svg-icons";

  export let h;
  export let navigate;
</script>

<td class={`px-6 py-2 text-xs text-white ${h.class || ""} ${h.param ? "cursor-pointer" : ""}`} on:click={() => h.param ? navigate(h.param) : null}>
  {#if h.sort === "asc"}
    <Fa icon={faSortAmountDownAlt} pull="left" /> &nbsp;
  {:else if h.sort === "desc"}
    <Fa icon={faSortAmountUp} pull="left"/> &nbsp;
  {/if}
  {h.title}
</td>
