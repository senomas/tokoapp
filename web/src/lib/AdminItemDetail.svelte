<script>
  import { supabase } from "./supabase";
  import AdminDetail from "./AdminDetail.svelte";
  import AdminInputText from "./AdminInputText.svelte";
  import AdminInputSelect from "./AdminInputSelect.svelte";

  export let user;
  export let config;
  export let params;

  let categories = null;
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
        categories = data.map((v) => ({
          id: v.id,
          name: v.full_name
            .replaceAll("<", "&lt;")
            .replaceAll(" || ", " &#187; "),
        }));
      }
      if (params.id === "--NEW--") {
        item = {};
      } else {
        let { data, error } = await supabase
          .from("items")
          .select("*")
          .eq(config.primaryKey || "id", params.id);
        console.log({ data, error });
        if (error) throw error;
        if (data.length === 1) {
          item = data[0];
        } else {
          item = {};
        }
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loading = false;
    }
  }

  async function saveData() {
    loading = true;
    try {
      ["category_id"].forEach((k) => {
        if (item[k] === "") {
          item[k] = null;
        }
      });
      if (params.id === "--NEW--") {
        let { data, error } = await supabase.from("items").insert(item);
        console.log({
          insert: {
            item,
            data,
            error,
          },
        });
      } else {
        const newItem = {
          ...item,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
          [config.primaryKey || "id"]: undefined,
        };
        let { data, error } = await supabase
          .from("items")
          .update(newItem)
          .eq(config.primaryKey || "id", parseInt(params.id));
        console.log({
          update: {
            item,
            data,
            newItem,
            key: { [config.primaryKey || "id"]: params.id },
            error,
          },
        });
      }
      history.back();
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
        .from("items")
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
  <title>TokoAPP - Item {params.id}</title>
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
      id="category"
      label="Category"
      {loading}
      bind:value={item.category_id}
      options={categories}
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
