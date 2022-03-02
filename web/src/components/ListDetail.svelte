<script lang="ts">
  import {goto} from '$app/navigation';

  export let value;

  let top;
  let translate;
  if (value.top) {
    top = `${value.top}px`;
    translate =
      '-ms-transform: translate(-50%, 0%); transform: translate(-50%, 0%);';
  } else {
    top = '50%';
    translate =
      '-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
  }

  function close() {
    const link = value.createLink({id: null, top: null});
    goto(link);
  }
</script>

<div class="veil" />
<div style="top:{top}; left:50%; {translate}" class="form">
  <div class="header">{value.title || value.from}</div>
  <div class="body">
    <slot />
  </div>
  <div class="footer">
    <button class="btn-primary">Save</button>
    <button class="btn-cancel" on:click={close}>Close</button>
  </div>
</div>
