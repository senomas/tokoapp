<script lang="ts">
  import { supabase } from "./supabase";
  import { useNavigate, useLocation } from "svelte-navigator";
  import AdminListHeader from "./AdminListHeader.svelte";

  export let config;
  export let entity;

  const location = useLocation();
  const nav = useNavigate();

  let param = { [entity]: {} };
  let loading = false;
  let fallback = false;
  let items = [];
  let itemsCount = 0;
  let pageSize: number;
  let page: number;
  let pageMax: number;
  let rangeStart: number;
  let rangeEnd: number;
  let pages = [];

  $: {
    const loc = $location;
    param[entity] = loc.search
      .split("?")
      .slice(-1)[0]
      .split("&")
      .map((v) => v.split("="))
      .reduce((acc, v) => {
        acc[v[0]] = v[1];
        return acc;
      }, {});
  }

  let headers = (config.list?.fields || config.fields).map((v) => ({
    ...v,
    title: v.name || v.id,
  }));

  function navigate(p, q, clearQ = false) {
    const loc = $location;
    if (!clearQ) {
      q = { ...param[entity], ...q };
    }
    const qk = Object.keys(q);
    qk.sort();
    loading = true;
    nav(
      `${p || loc.pathname}?${qk
        .filter((k) => k.length > 0)
        .map((k) => `${k}=${encodeURIComponent(q[k])}`)
        .join("&")}`
    );
  }

  async function fetchData(entity, p) {
    loading = true;
    const timeout = setTimeout(() => {
      fallback = true;
    }, 200);
    try {
      const param = p[entity] || (p[entity] = {});
      pageSize = Math.min(100, param.ps ?? config.pageSize ?? 10);
      const pagingSize = Math.min(20, param.pgs ?? config.pagingSize ?? 10);
      const pagingSize1 = pageSize - 1;
      const pagingSize2 = Math.floor(pageSize / 2);
      page = parseInt(param.p ?? 1);
      rangeStart = (page - 1) * pageSize;
      rangeEnd = rangeStart + pageSize - 1;
      const orderField = param.of || config.primaryKey || "id";
      const orderAsc = (param.oa ?? "a") === "a";
      let { data, count, error } = await supabase
        .from(config?.list?.entity || config?.entity || entity)
        .select(config.listSelect || "*", { count: "exact" })
        .order(orderField, { ascending: orderAsc })
        .range(rangeStart, rangeEnd);
      // console.log({ entity, config, param, data, count, error });
      headers = (config.list?.fields || config.fields).map((v) => {
        const nv = { ...v };
        if (nv.id === orderField) {
          nv.sort = orderAsc ? "a" : "d";
          nv.param = {
            of: v.id,
            oa: orderAsc ? "d" : "a",
          };
        } else if (v.sortable) {
          nv.param = {
            ...param,
            of: v.id,
            oa: "a",
          };
        }
        nv.title = v.name || v.id;
        return nv;
      });
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      if (error) throw error;
      items = data;
      itemsCount = count;
      pageMax = Math.floor((itemsCount + pageSize - 1) / pageSize);
      let pmin = Math.max(1, page - pagingSize2);
      const pmax = Math.min(pageMax, pmin + pagingSize1);
      pmin = Math.max(1, pmax - pagingSize1);
      pages = [];
      pages.push({
        title: "+",
        link: "--NEW--",
        param: {},
      });
      pages.push({
        title: "\u2759\u276E",
        param: page > 1 ? { p: 1 } : undefined,
      });
      pages.push({
        title: "\u276E\u276E",
        param: page > 1 ? { p: Math.max(1, pmin - 1) } : undefined,
      });
      pages.push({
        title: "\u276E",
        param: page > 1 ? { p: page - 1 } : undefined,
      });
      for (let p = pmin; p <= pmax; p++) {
        if (p === page) {
          pages.push({ title: String(p) });
        } else {
          pages.push({
            title: String(p),
            param: { p },
          });
        }
      }
      pages.push({
        title: "\u276F",
        param: page < pageMax ? { p: page + 1 } : undefined,
      });
      pages.push({
        title: "\u276F\u276F",
        param: page < pageMax ? { p: Math.min(pageMax, pmax + 1) } : undefined,
      });
      pages.push({
        title: "\u276F\u2759",
        param: page < pageMax ? { p: pageMax } : undefined,
      });
    } catch (error) {
      console.log({ error });
    } finally {
      clearTimeout(timeout);
      fallback = false;
      loading = false;
    }
  }

  $: {
    fetchData(entity, param);
  }
</script>

<svelte:head>
  <title>TokoAPP - {config.name || entity} List</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="en" />
</svelte:head>

<div>
  <table class="w-full table-fixed border border-gray-300">
    <thead class="bg-black">
      {#each headers as h}
        <AdminListHeader {h} {navigate} />
      {/each}
    </thead>
    {#if fallback}
      <tbody class="bg-white">
        {#each items.length === 0 ? [{}] : items as item, i}
          <tr
            class={`text-center ${
              i % 2 == 1 ? "bg-gray-50" : ""
            } whitespace-nowrap`}
          >
            <td
              colspan={headers.length}
              class="px-6 py-1 text-sm text-gray-500 border border-gray-300"
              >Loading...</td
            >
          </tr>
        {/each}
      </tbody>
    {:else}
      <tbody class="bg-white text-sm text-gray-500 text-left">
        {#each items as item, i}
          <tr
            class={`whitespace-nowrap ${i % 2 == 1 ? "bg-gray-100" : ""}`}
            on:click={() =>
              navigate(
                `${$location.pathname}/${item[config.primaryKey || "id"]}`,
                {}
              )}
          >
            {#each headers as f}
              <td class="px-6 py-1 border border-gray-300"
                >{@html f.render ? f.render(item[f.id]) : item[f.id] || ""}</td
              >
            {/each}
          </tr>
        {/each}
      </tbody>
    {/if}
    <tfoot class="bg-gray-300">
      <td colspan={headers.length} class="text-xs">
        <table class="w-full">
          <tr>
            <td class="px-2 py-2 text-xs text-left">
              Showing {rangeStart + 1} to {rangeStart + items.length} of {itemsCount}
              entries</td
            >
            <td class="px-2 py-2 text-xs text-right">
              {#each pages as p}
                {#if p.param}
                  <span class="px-2 py-2 text-blue-500 font-bold"
                    ><button on:click={() => navigate(p.link, p.param)}
                      >{p.title}</button
                    ></span
                  >
                {:else}
                  <span class="px-2 py-2 text-black font-bold">{p.title}</span>
                {/if}
              {/each}
            </td>
          </tr>
        </table>
      </td>
    </tfoot>
  </table>
</div>
