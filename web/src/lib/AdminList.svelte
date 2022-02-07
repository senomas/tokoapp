<script lang="ts">
  import { supabase } from "./supabase";
  import AdminListHeader from "./AdminListHeader.svelte";

  export let config;
  export let entity;
  export let query;

  let param = { [entity]: query };
  let loading = false;
  let items = [];
  let itemsCount = 0;
  let pageSize: number;
  let page: number;
  let pageMax: number;
  let rangeStart: number;
  let rangeEnd: number;
  let pages = [];

  let headers = (config.list?.fields || config.fields).map((v) => ({
    ...v,
    title: v.name || v.id,
  }));

  function navigate(q) {
    console.log({ navigate: { q } });
    param = { ...param, [entity]: q };
  }

  async function fetchData(entity, query, p) {
    const timeout = setTimeout(() => {
      loading = true;
    }, 200);
    try {
      const param = p[entity] || (p[entity] = {});
      pageSize = Math.min(100, param.ps ?? config.pageSize ?? 10);
      const pagingSize = Math.min(20, param.pgs ?? config.pagingSize ?? 10);
      const pagingSize1 = pageSize - 1;
      const pagingSize2 = Math.floor(pageSize / 2);
      page = param.p ?? 1;
      rangeStart = (page - 1) * pageSize;
      rangeEnd = rangeStart + pageSize - 1;
      const orderField = param.of || config.defaultOrder || "id";
      const orderAsc = param.oa ?? true;
      let { data, count, error } = await supabase
        .from(config?.list?.entity || config?.entity || entity)
        .select(config.listSelect || "*", { count: "exact" })
        .order(orderField, { ascending: orderAsc })
        .range(rangeStart, rangeEnd);
      // console.log({ entity, config, param, data, count, error });
      headers = (config.list?.fields || config.fields).map((v) => {
        const nv = { ...v };
        if (nv.id === orderField) {
          nv.sort = orderAsc ? "asc" : "desc";
          nv.param = {
            ...param,
            of: v.id,
            oa: !orderAsc,
          };
        } else if (v.sortable) {
          nv.param = {
            ...param,
            of: v.id,
            oa: true,
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
        title: "\u2759\u276E",
        param: page > 1 ? { ...param, p: 1 } : undefined,
      });
      pages.push({
        title: "\u276E\u276E",
        param: page > 1 ? { ...param, p: Math.max(1, pmin - 1) } : undefined,
      });
      pages.push({
        title: "\u276E",
        param: page > 1 ? { ...param, p: page - 1 } : undefined,
      });
      for (let p = pmin; p <= pmax; p++) {
        if (p === page) {
          pages.push({ title: String(p) });
        } else {
          pages.push({
            title: String(p),
            param: { ...param, p },
          });
        }
      }
      pages.push({
        title: "\u276F",
        param: page < pageMax ? { ...param, p: page + 1 } : undefined,
      });
      pages.push({
        title: "\u276F\u276F",
        param:
          page < pageMax
            ? { ...param, p: Math.min(pageMax, pmax + 1) }
            : undefined,
      });
      pages.push({
        title: "\u276F\u2759",
        param: page < pageMax ? { ...param, p: pageMax } : undefined,
      });
    } catch (error) {
      console.log({ error });
    } finally {
      clearTimeout(timeout);
      loading = false;
    }
  }

  $: {
    console.log(JSON.stringify({ entity, param, query }, undefined, 2));
    fetchData(entity, query, param);
  }
</script>

<div>
  <table class="w-full table-fixed">
    <thead class="bg-black">
      {#each headers as h}
        <AdminListHeader {h} {navigate} />
      {/each}
    </thead>
    {#if loading}
      <tbody class="bg-white divide-y divide-gray-300">
        {#each items.length === 0 ? [{}] : items as item, i}
          <tr
            class={`text-center ${
              i % 2 == 1 ? "bg-gray-50" : ""
            } whitespace-nowrap`}
          >
            <td colspan={headers.length} class="px-6 py-1 text-sm text-gray-500"
              >Loading...</td
            >
          </tr>
        {/each}
      </tbody>
    {:else}
      <tbody class="bg-white divide-y divide-gray-300">
        {#each items as item, i}
          <tr
            class={`text-left ${
              i % 2 == 1 ? "bg-gray-50" : ""
            } whitespace-nowrap`}
          >
            {#each headers as f}
              <td class="px-6 py-1 text-sm text-gray-500"
                >{@html f.render ? f.render(item[f.id]) : item[f.id] || ""}</td
              >
            {/each}
          </tr>
        {/each}
      </tbody>
    {/if}
    <tfoot class="bg-gray-300">
      <td
        colspan={Math.floor(headers.length / 2)}
        class="px-2 py-2 text-xs text-left"
        >Showing {rangeStart + 1} to {rangeStart + items.length} of {itemsCount}
        entries</td
      >
      <td
        colspan={headers.length - Math.floor(headers.length / 2)}
        class="px-2 py-2 text-xs text-right"
      >
        {#each pages as p}
          {#if p.param}
            <span class="px-2 py-2 text-blue-500"
              ><button on:click={() => navigate(p.param)}>{p.title}</button
              ></span
            >
          {:else}
            <span class="px-2 py-2 text-black">{p.title}</span>
          {/if}
        {/each}
      </td>
    </tfoot>
  </table>
</div>
