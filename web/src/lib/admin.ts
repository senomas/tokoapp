export const config = {
  "item-category": {
    name: "Item Category",
    entity: "item_categories",
    detail: "./AdminItemCategoryDetail.svelte",
    list: {
      entity: "item_category_views",
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
    }
  },
  item: {
    name: "Item",
    entity: "items",
    detail: "./AdminItemDetail.svelte",
    list: {
      entity: "item_views",
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
}
