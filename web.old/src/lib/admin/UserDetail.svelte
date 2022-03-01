<script>
  import {supabase} from '../supabase';
  import Detail from './Detail.svelte';
  import InputText from '../form/InputText.svelte';
  import InputSelect from '../form/InputSelect.svelte';
  import Error from './Error.svelte';

  export let user;
  export let id;
  export let primaryKey;
  export let navigate;
  export let top = null;

  let categories = null;
  let validate = {};
  let loading = false;
  let visible;

  let item = {};
  let name = id;

  let errorComp;
  let errorMessage;

  async function fetchData(_, id) {
    loading = true;
    try {
      if (!categories) {
        let {data, error} = await supabase
          .from('item_category_views')
          .select('*');
        if (error) throw error;
        categories = data.map(v => ({
          id: v.id,
          name: v.full_name
        }));
      }
      if (!id || id === '__NEW__') {
        item = {};
      } else {
        let {data, error} = await supabase
          .from('items')
          .select('*')
          .eq(primaryKey, id);
        if (error) throw error;
        if (data.length === 1) {
          item = data[0];
          name = item.name;
        } else {
          item = {};
        }
      }
    } catch (error) {
      console.log({error});
    } finally {
      loading = false;
    }
  }

  async function saveData(event) {
    loading = true;
    try {
      console.log({saveData: {id, item}});
      if (id === '__NEW__') {
        let {data, error} = await supabase.from('items').insert(item);
        console.log({
          insert: {
            item,
            data,
            error
          }
        });
        if (error) throw error;
      } else {
        const newItem = {
          ...Object.entries(item).reduce((acc, [k, v]) => {
            if (v === '') {
              acc[k] = null;
            } else {
              acc[k] = v;
            }
            return acc;
          }, {}),
          updated_at: new Date().toISOString(),
          updated_by: user.id,
          [primaryKey]: undefined
        };
        let {data, error} = await supabase
          .from('items')
          .update(newItem)
          .eq(primaryKey, id);
        console.log({
          update: {
            item,
            data,
            newItem,
            key: {[primaryKey]: id},
            error
          }
        });
        if (error) throw error;
      }
      navigate(null, {id: null});
    } catch (error) {
      console.log({event, error});
      errorMessage = error.message || 'System Error';
      errorComp.show(event.detail);
    } finally {
      loading = false;
    }
  }

  async function deleteData(event) {
    loading = true;
    try {
      let {data, error} = await supabase
        .from('items')
        .delete()
        .eq(primaryKey, id);
      if (error) throw error;
      if (data.length === 0)
        throw {message: `Unable to delete Item "${name || id}"`};
      console.log({
        delete: {
          item,
          data,
          key: {[primaryKey]: id},
          error
        }
      });
      navigate(null, {id: null});
    } catch (error) {
      console.log({event, error});
      errorMessage = error.message || 'System Error';
      errorComp.show(event.detail);
    } finally {
      loading = false;
    }
  }

  $: {
    visible = !!id;
    fetchData(user, id);
  }
</script>

<Detail
  title={id && id !== '__NEW__' ? `Item "${name || id}"` : 'New Item'}
  {visible}
  {loading}
  {id}
  {name}
  {navigate}
  {top}
  on:save={e => saveData(e)}
  on:delete={e => deleteData(e)}
>
  <div class="flex flex-wrap mb-6">
    {#if id && id !== '__NEW__'}
      <InputText
        id="id"
        {loading}
        bind:value={item.id}
        validate={validate.id}
        readonly={true}
        class="md:w-1/2"
      />
    {/if}
    <InputSelect
      id="category"
      {loading}
      bind:value={item.category_id}
      options={categories}
      validate={validate.name}
      class="md:w-1/2"
    />
    <InputText
      id="name"
      {loading}
      bind:value={item.name}
      validate={validate.name}
      class="md:w-1/2"
    />
    <InputText
      id="description"
      {loading}
      bind:value={item.description}
      validate={validate.description}
    />
  </div>
</Detail>

<Error bind:this={errorComp}>{errorMessage}</Error>
