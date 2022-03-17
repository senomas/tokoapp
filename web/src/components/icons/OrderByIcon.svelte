<script lang="ts">
  import type {FetchListResult} from 'src/supabase';

  import CarretDownIcon from './CarretDownIcon.svelte';
  import CarretUpIcon from './CarretUpIcon.svelte';

  export let id: string;
  export let value: FetchListResult;
</script>

<div class="relative">
  <div class="absolute left-0">
    <CarretUpIcon
      class={value.order.field === id && !value.order.asc
        ? 'active'
        : 'inactive'}
    />
  </div>
  <div class="absolute left-0 top-2">
    <CarretDownIcon
      class={value.order.field === id && value.order.asc
        ? 'active'
        : 'inactive'}
    />
  </div>
</div>
