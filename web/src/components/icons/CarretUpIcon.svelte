<script lang="ts">
  let clazz = '';
  export {clazz as class};

  export let x = 0;
  export let y = 0;
  export let width = 20;
  export let height = 20;
  export let viewBox = `0 0 30 30`;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
  class={clazz}
  {width}
  {height}
  {x}
  {y}
  {viewBox}
  style="enable-background:new 0 0 512 512"
  xml:space="preserve"
  ><g
    ><path
      xmlns="http://www.w3.org/2000/svg"
      d="M6.414,15.586H17.586a1,1,0,0,0,.707-1.707L12.707,8.293a1,1,0,0,0-1.414,0L5.707,13.879A1,1,0,0,0,6.414,15.586Z"
      data-original="#000000"
    /></g
  ></svg
>
