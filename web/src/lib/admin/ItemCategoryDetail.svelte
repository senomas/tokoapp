<script>
  import { supabase } from "../supabase";
  import AdminDetail from "./Detail.svelte";
  import AdminInputText from "../form/InputText.svelte";
  import AdminInputSelect from "../form/InputSelect.svelte";

  export let user;
  export let config;
  export let params;

  let categories = null;
  let parents = null;
  let validate = {};
  let item = {};
  let loading = false;

  async function fetchData(_, params) {
    loading = true;
    try {
      if (!categories) {
        let { data, error } = await supabase
          .from("item_category_views")
          .select("*");
        if (error) throw error;
        categories = data;
      }
      let { data, error } = await supabase
        .from("item_categories")
        .select("*")
        .eq(config.primaryKey || "id", params.id);
      if (error) throw error;
      if (data.length === 1) {
        item = data[0];
      } else {
        item = {};
      }
      const getChilds = (parent_id) => {
        const res = categories.filter(
          (c) => c.parent_id === parent_id && c.id !== item?.id
        );
        const cres = [];
        for (const r of res) {
          cres.push(...getChilds(r.id));
        }
        return [...res, ...cres];
      };
      parents = getChilds(null).map((v) => ({
        id: v.id,
        name: v.full_name
          .replaceAll("<", "&lt;")
          .replaceAll(" || ", " &#187; "),
      }));
      parents.sort((a, b) =>
        a.name === b.name ? 0 : a.name > b.name ? 1 : -1
      );
    } catch (error) {
      console.log({ error });
    } finally {
      loading = false;
    }
  }

  async function saveData() {
    loading = true;
    try {
      ["parent"].forEach((k) => {
        if (item[k] === "") {
          item[k] = null;
        }
      });
      const newItem = {
        ...item,
        [config.primaryKey || "id"]: undefined,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      };
      let { data, error } = await supabase
        .from("item_categories")
        .update(newItem)
        .eq(config.primaryKey || "id", parseInt(params.id));
      console.log({
        save: {
          item,
          data,
          newItem,
          key: { [config.primaryKey || "id"]: params.id },
          error,
        },
      });
    } catch (error) {
      console.log({ error });
    } finally {
      loading = false;
    }
  }

  async function deleteData() {
    loading = true;
    try {
      let { data, error } = await supabase
        .from("item_categories")
        .delete()
        .eq(config.primaryKey || "id", parseInt(params.id));
      console.log({
        delete: {
          item,
          data,
          key: { [config.primaryKey || "id"]: params.id },
          error,
        },
      });
      history.back();
    } catch (error) {
      console.log({ error });
    } finally {
      loading = false;
    }
  }

  $: {
    fetchData(user, params);
  }
</script>

<svelte:head>
  <title>TokoAPP - Item Category {params.id}</title>
  <meta name="robots" content="noindex nofollow" />
  <html lang="en" />
</svelte:head>

<AdminDetail {config} {params} {loading} {saveData} {deleteData}>
  <div class="flex flex-wrap -mx-3 mb-6">
    <AdminInputText
      id="id"
      label="ID"
      {loading}
      bind:value={item.id}
      validate={validate.id}
      readonly={true}
      class="md:w-1/2"
    />
    <AdminInputSelect
      id="parent"
      label="Parent"
      {loading}
      bind:value={item.parent_id}
      options={parents}
      validate={validate.name}
      class="md:w-1/2"
    />
    <AdminInputText
      id="name"
      label="Name"
      {loading}
      bind:value={item.name}
      validate={validate.name}
      class="md:w-1/2"
    />
  </div>
  <div class="flex flex-wrap -mx-3">
    <AdminInputText
      id="description"
      label="Description"
      {loading}
      bind:value={item.description}
      validate={validate.description}
    />
  </div>
</AdminDetail>
