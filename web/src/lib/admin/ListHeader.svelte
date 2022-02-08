<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faSortAmountDownAlt,
    faSortAmountUp,
  } from "@fortawesome/free-solid-svg-icons";

  export let h: any;
  export let navigate: (p: any, q: any, clearQ?: boolean) => void;
</script>

<td
  class={`px-6 py-2 text-xs text-white border border-gray-500 ${
    h.class || ""
  } ${h.param ? "cursor-pointer" : ""}`}
  on:click={() => (h.param ? navigate(null, h.param) : null)}
>
  {#if h.sort === "a"}
    <Fa icon={faSortAmountDownAlt} pull="left" /> &nbsp;
  {:else if h.sort === "d"}
    <Fa icon={faSortAmountUp} pull="left" /> &nbsp;
  {/if}
  {h.title}
</td>
