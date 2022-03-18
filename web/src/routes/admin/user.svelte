<script lang="ts">
  import {filter_ilike, type FetchList} from '../../supabase';
  import List from '../../components/headless/List.svelte';
  import OrderByIcon from '../../components/icons/OrderByIcon.svelte';
  import Input from '../../components/lib/Input.svelte';

  let config: FetchList = {
    table: 'user_views',
    cache: 60000,
    detail: {
      view: 'user_views',
      select: '*',
      fields: ['email', 'roles'],
      options: {
        categories: {
          table: 'item_category_views',
          key: 'id',
          value: 'full_name',
          order: 'full_name'
        }
      }
    },
    list: {
      view: 'user_views',
      select: '*',
      filter: {
        id: filter_ilike,
        email: filter_ilike,
        roles: filter_ilike
      }
    }
  };

  let filter = {};
  let item = {};
  function onChange(value) {
    filter = value.detail.filter;
    item = value.detail.item;
  }
</script>

<List {config} let:value let:loadingAnimation on:change={onChange}>
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
            <div>EMail</div>
            <OrderByIcon id="email" {value} />
          </div></td
        >
        <td on:click={value.toggleOrder('name')}
          ><div class="flex space-x-1 justify-center">
            <div>Roles</div>
            <OrderByIcon id="roles" {value} />
          </div></td
        >
      </tr>
    </thead>
    <tbody>
      {#each value.items as item}
        <tr on:click={item.open}>
          <td class="sm:hidden color-header">ID</td>
          <td class="sm:hidden" colspan="3">{item.id}</td>
          <td class="hidden sm:table-cell">{item.id}</td>
          <td class="hidden sm:table-cell">{item.email}</td>
          <td class="hidden sm:table-cell">{item.roles}</td>
        </tr>
        <tr class="sm:hidden" on:click={item.open}>
          <td class="sm:hidden color-header">Category</td>
          <td class="sm:hidden" colspan="3">{item.email}</td>
        </tr>
        <tr class="sm:hidden" on:click={item.open}>
          <td class="sm:hidden color-header">Name</td>
          <td class="sm:hidden" colspan="3">{item.roles}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">
          <div class="flex justify-between px-1">
            <div>
              {#if value.total > 0}
                {value.paging.rangeStart} - {value.paging.rangeEnd} of {value.total}
              {:else}
                No data
              {/if}
            </div>
            <div class="flex space-x-4">
              <div
                class={Object.keys(filter).length > 0 ? 'link' : 'link-'}
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
            <Input
              type="text"
              id="category"
              bind:value={filter}
              class="w-full"
            />
            <Input
              type="text"
              id="description"
              bind:value={filter}
              class="w-full"
            />
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
            <Input type="text" id="name" bind:value={item} class="w-full" />
            <Input
              type="select"
              id="category_id"
              bind:value={item}
              class="w-full"
              options={value.options.categories}
            />
            <Input
              type="text"
              id="description"
              bind:value={item}
              class="w-full"
            />
          </div>
          <div class="footer">
            <button class="btn-primary" on:click={value.detailSave(item)}
              >Save</button
            >
            <button class="btn-cancel" on:click={value.detailClose}
              >Close</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if loadingAnimation}
    <div class="veil-loading grid sm:content-center border-0">
      <div class="text-white border-0 w-full flex justify-center">
        <div class="border-0">
          <div class="header">LOADING</div>
        </div>
      </div>
    </div>
  {/if}
</List>
