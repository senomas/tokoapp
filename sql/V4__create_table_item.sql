CREATE TABLE item_categories (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  parent_id INT REFERENCES item_categories,
  name TEXT NOT NULL,
  description TEXT,
  CONSTRAINT item_categories_check CHECK (char_length(name) >= 3 AND char_length(name) < 255),
  CONSTRAINT item_categories__name UNIQUE(parent_id, name)
);
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select item_categories with permissions item_categories.select" ON item_categories FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'item_categories.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update item_categories with permissions item_categories.update" ON item_categories FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'item_categories.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'item_categories.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert item_categories with permissions item_categories.insert" ON item_categories FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'item_categories.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete item_categories with permissions item_categories.delete" ON item_categories FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'item_categories.delete') AND auth.uid() = u.id
    )
  );


CREATE FUNCTION fn_item_category_views()
RETURNS TABLE (
  id INT,
  parent_id INT,
  parent TEXT,
	name TEXT,
  full_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by UUID
)
LANGUAGE sql
SECURITY INVOKER
AS $$
  WITH RECURSIVE item_category_recursive (id, parent_id, parent, name, full_name, description, created_at, created_by, updated_at, updated_by) AS (
  SELECT
    id,
    parent_id,
    '' AS parent,
    name,
    name AS full_name,
    description,
    created_at,
    created_by,
    updated_at,
    updated_by
  FROM
    item_categories
  WHERE
    parent_id IS NULL
  UNION ALL
    SELECT
      e.id,
      e.parent_id,
      rl.name AS parent,
      e.name,
      rl.name || E' \u00BB ' || e.name AS full_name,
      e.description,
      e.created_at,
      e.created_by,
      e.updated_at,
      e.updated_by
    FROM
      item_categories e
    INNER JOIN item_category_recursive rl ON e.parent_id = rl.id) SELECT * FROM item_category_recursive;
$$;

CREATE VIEW item_category_views AS SELECT * FROM fn_item_category_views();


CREATE TABLE items (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  category_id INT REFERENCES item_categories,
  name TEXT NOT NULL,
  description TEXT,
  CONSTRAINT items_check CHECK (char_length(name) >= 3 AND char_length(name) < 255),
  CONSTRAINT items__name UNIQUE(category_id, name)
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select items with permissions items.select" ON items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'items.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update items with permissions items.update" ON items FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'items.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'items.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert items with permissions items.insert" ON items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'items.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete items with permissions items.delete" ON items FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'items.delete') AND auth.uid() = u.id
    )
  );


CREATE FUNCTION fn_item_views()
RETURNS TABLE (
  id INT,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE,
  updated_by UUID,
  category_id INT,
  name TEXT,
  description TEXT,
  category TEXT
)
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT
    i.*,
    ic.full_name AS category
  FROM
    items i 
    LEFT JOIN item_category_views ic ON i.category_id = ic.id;
$$;

CREATE VIEW item_views AS SELECT * FROM fn_item_views();
