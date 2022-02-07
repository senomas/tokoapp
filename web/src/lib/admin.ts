export const config = {
  "item-category": {
    name: "Item Category",
    entity: "item_category_views",
    detail: "./AdminItemCategoryDetail.svelte",
    fields: [
      {
        id: "id",
        name: "ID",
        sortable: true,
        class: "w-20",
      },
      {
        id: "full_name",
        name: "Name",
        sortable: true,
        render: (v) => {
          if (v) {
            return v.replaceAll("<", "&lt;").replaceAll(" || ", " &#187; ");
          }
          return v;
        }
      },
      {
        id: "description",
        name: "Description",
        class: "w-100",
      },
    ],
  },
  item: {
    name: "Item",
    entity: "item_views",
    detail: "./AdminItemDetail.svelte",
    fields: [
      {
        id: "id",
        name: "ID",
        sortable: true,
        class: "w-20",
      },
      {
        id: "category",
        render: (v) => {
          if (v) {
            return v.replaceAll("<", "&lt;").replaceAll(" || ", " &#187; ");
          }
          return v;
        },
        name: "Category",
        sortable: true,
        class: "w-80",
      },
      {
        id: "name",
        name: "Name",
        sortable: true,
      },
      {
        id: "description",
        name: "Description",
        class: "w-100",
      },
    ],
  }
}