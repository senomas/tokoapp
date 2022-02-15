<script>
  import {supabase} from '../supabase';
  import Detail from './Detail.svelte';
  import InputText from '../form/InputText.svelte';
  import InputSelect from '../form/InputSelect.svelte';

  export let user;
  export let id;
  export let primaryKey;
  export let navigate;
  export let top = '10rem';

  let categories = null;
  let parents = [];
  let validate = {};
  let loading = false;
  let visible;

  let item = {};
  let name = id;

  async function fetchData(_, id) {
    loading = true;
    try {
      if (!categories) {
        let {data, error} = await supabase
          .from('item_category_views')
          .select('*');
        if (error) throw error;
        categories = data;
      }
      if (!id || id === '__NEW__') {
        item = {};
        parents = categories.map(v => ({
          id: v.id,
          name: v.full_name
        }));
      } else {
        let {data, error} = await supabase
          .from('item_categories')
          .select('*')
          .eq(primaryKey, id);
        const getChilds = parent_id => {
          const r = categories.filter(
            v => v.parent_id === parent_id && v.id !== id
          );
          const rs = [];
          r.forEach(v => {
            rs.push(...getChilds(v.id));
          });
          return [...r, ...rs];
        };
        parents = getChilds(null).map(v => ({
          id: v.id,
          name: v.full_name
        }));
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

  async function saveData() {
    loading = true;
    try {
      console.log({saveData: {id, item}});
      if (id === '__NEW__') {
        let {data, error} = await supabase.from('item_categories').insert(item);
        console.log({
          insert: {
            item,
            data,
            error
          }
        });
      } else {
        const newItem = {
          ...item,
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
      }
      navigate(null, {id: null});
    } catch (error) {
      console.log({error});
    } finally {
      loading = false;
    }
  }

  async function deleteData() {
    loading = true;
    try {
      let {data, error} = await supabase
        .from('item_categories')
        .delete()
        .eq(primaryKey, id);
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
      console.log({error});
    } finally {
      loading = false;
    }
  }

  $: {
    visible = !!id;
    fetchData(user, parseInt(id));
  }
</script>

<Detail
  title={id && id !== '__NEW__'
    ? `Item Category "${name || id}"`
    : 'New Item Category'}
  {visible}
  {loading}
  {id}
  {name}
  {navigate}
  {top}
  on:save={saveData}
  on:delete={deleteData}
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
      id="parent"
      {loading}
      bind:value={item.parent_id}
      options={parents}
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
