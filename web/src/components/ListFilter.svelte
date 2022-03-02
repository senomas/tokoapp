<script lang="ts">
  import {goto} from '$app/navigation';

  export let value;

  let top = '50%';
  let left = '50%';
  let translate =
    '-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';

  function filterApply() {
    goto(
      value.createLink({
        showFilter: false,
        filter: Object.entries(value.filter as {[k: string]: string}).reduce(
          (acc, [k, v]) => {
            if (v && !!v.trim()) {
              acc[k] = v;
            }
            return acc;
          },
          {}
        )
      })
    );
  }

  function filterReset() {
    const link = value.createLink({showFilter: false, filter: {}});
    goto(link);
  }
</script>

{#if value.showFilter}
  <div class="veil" />
  <div style="top:{top}; left:{left}; {translate}" class="form">
    <div class="header">Filter</div>
    <div class="body">
      <slot />
    </div>
    <div class="footer">
      <button class="btn-primary" on:click={filterApply}>Apply</button>
      <button class="btn-cancel" on:click={filterReset}>Reset</button>
    </div>
  </div>
{/if}
