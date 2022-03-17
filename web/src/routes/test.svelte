<script lang="ts">
  import {filter_ilike} from '../supabase';
  import List from '../components/headless/List.svelte';
  import OrderByIcon from '../components/icons/OrderByIcon.svelte';
  import Input from '../components/lib/Input.svelte';

  let config = {
    table: 'items',
    select: '*',
    list: {
      view: 'item_views',
      select: '*',
      filter: {
        id: filter_ilike,
        category: filter_ilike,
        name: filter_ilike,
        description: filter_ilike
      }
    }
  };

  let filter = {};
</script>

<List {config} let:value>
  <table class="headless">
    <thead class="sm:hidden">
      <tr><td colspan="4">TABLE HEADER</td></tr>
    </thead>
    <thead class="hidden sm:table-header-group">
      <tr>
        <td on:click={value.toggleOrder('id')}
          ><div class="flex space-x-1 justify-center">
            <div>ID</div>
            <OrderByIcon id="id" {value} />
          </div>
        </td>
        <td on:click={value.toggleOrder('category')}
          ><div class="flex space-x-1 justify-center">
            <div>Category</div>
            <OrderByIcon id="category" {value} />
          </div></td
        >
        <td on:click={value.toggleOrder('name')}
          ><div class="flex space-x-1 justify-center">
            <div>Name</div>
            <OrderByIcon id="name" {value} />
          </div></td
        >
        <td class="hidden lg:table-cell">Description</td>
      </tr>
    </thead>
    <tbody>
      {#each value.items as item}
        <tr on:click={item.open}>
          <td class="sm:hidden color-header">ID</td>
          <td class="sm:hidden" colspan="3">{item.id}</td>
          <td class="hidden sm:table-cell">{item.id}</td>
          <td class="hidden sm:table-cell">{item.category}</td>
          <td class="hidden sm:table-cell">{item.name}</td>
          <td class="hidden lg:table-cell">{item.description}</td>
        </tr>
        <tr class="sm:hidden" on:click={item.open}>
          <td class="sm:hidden color-header">Category</td>
          <td class="sm:hidden" colspan="3">{item.category}</td>
        </tr>
        <tr class="sm:hidden" on:click={item.open}>
          <td class="sm:hidden color-header">Name</td>
          <td class="sm:hidden" colspan="3">{item.name}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4">
          {#if value.total > 0}
            <div class="flex justify-between">
              <div>
                {value.paging.rangeStart} - {value.paging.rangeEnd} of {value.total}
              </div>
              <div class="flex space-x-4">
                <div
                  class={value.paging.page > 1 ? 'link' : 'link-'}
                  on:click={value.showFilter}
                >
                  FILTER
                </div>
                <div
                  class={value.paging.page > 1 ? 'link' : 'link-'}
                  on:click={value.gotoPage(1)}
                >
                  &#x2759;&#x276E;
                </div>
                <div
                  class={value.paging.page > 1 ? 'link' : 'link-'}
                  on:click={value.gotoPage(value.paging.page - 1)}
                >
                  &#x276E;
                </div>
                {#each value.paging.pages as p}
                  <div
                    class={value.paging.page != p ? 'link' : 'link-'}
                    on:click={value.gotoPage(p)}
                  >
                    {p}
                  </div>
                {/each}
                <div
                  class={value.paging.page < value.paging.lastPage
                    ? 'link'
                    : 'link-'}
                  on:click={value.gotoPage(value.paging.page + 1)}
                >
                  &#x276F;
                </div>
                <div
                  class={value.paging.page < value.paging.lastPage
                    ? 'link'
                    : 'link-'}
                  on:click={value.gotoPage(value.paging.lastPage)}
                >
                  &#x276F;&#x2759;
                </div>
              </div>
            </div>
          {:else}
            No data
          {/if}
        </td>
      </tr>
    </tfoot>
  </table>
  {#if value.filterVisible}
    <div class="veil grid sm:content-center border-0">
      <div class="text-white border-0 w-full flex justify-center">
        <div class="border-0 w-full sm:w-[600px] form">
          <div class="header">Filter</div>
          <div class="body">
            <Input type="text" id="name" bind:value={filter} class="w-full" />
          </div>
          <div class="footer">
            <button class="btn-primary" on:click={value.filterApply(filter)}
              >Apply</button
            >
            <button class="btn-cancel" on:click={value.filterClose}
              >Close</button
            >
            <button class="btn-cancel" on:click={value.filterReset}
              >Reset</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if value.item}
    <div class="veil grid sm:content-center border-0">
      <div class="text-white border-0 w-full flex justify-center">
        <div class="border-0 w-full sm:w-[600px] form">
          <div class="header">Edit Item</div>
          <div class="body">
            <pre>{JSON.stringify(value.item, undefined, 2)}</pre>
          </div>
          <div class="footer">
            <button class="btn-primary" on:click={value.detailSave}>Save</button
            >
            <button class="btn-cancel" on:click={value.detailClose}
              >Close</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</List>
