<script lang="ts">
  import Nav from "./lib/Nav.svelte";
  import Hero from "./lib/Hero.svelte";
  import Team from "./lib/Team.svelte";
  import Services from "./lib/Services.svelte";
  import Footer from "./lib/Footer.svelte";
</script>

<main class="max-w mx-auto px-4">
  <div class="pt-4 pb-12">
    <Nav />
    <Hero />
    <Services />
    <Team />
    <Footer />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
