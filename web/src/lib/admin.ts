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
      },
      {
        id: "name",
        name: "Name",
        sortable: true,
      },
      {
        id: "description",
        name: "Description"
      },
    ],
  }
}