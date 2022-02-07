export const config = {
  "item-category": {
    entity: "item_category_views",
    fields: [
      {
        id: "id",
      },
      {
        id: "full_name",
        render: (v) => {
          if (v) {
            return v.replaceAll("<", "&lt;").replaceAll(" || ", " &#187; ");
          }
          return v;
        }
      },
      {
        id: "description",
      },
    ],
  },
  item: {
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