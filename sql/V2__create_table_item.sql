DROP FUNCTION IF EXISTS fn_item_category_views CASCADE;
DROP FUNCTION IF EXISTS fn_item_category_views CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP VIEW IF EXISTS item_category_views CASCADE;
DROP FUNCTION IF EXISTS fn_item_views CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP VIEW IF EXISTS item_views CASCADE;

CREATE TABLE item_categories (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  parent_id INT REFERENCES item_categories,
  name TEXT NOT NULL,
  description TEXT,
  CONSTRAINT item_categories__name UNIQUE(parent_id, name)
);

ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select item_categories with permissions item_categories.select" ON public.item_categories FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'item_categories.select' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "update item_categories with permissions item_categories.update" ON public.item_categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'item_categories.update' AND auth.uid() = ur.user_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'item_categories.update' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "insert item_categories with permissions item_categories.insert" ON public.item_categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'item_categories.insert' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "delete item_categories with permissions item_categories.delete" ON public.item_categories FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'item_categories.delete' AND auth.uid() = ur.user_id)
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
  CONSTRAINT items__name UNIQUE(category_id, name)
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select items with permissions items.select" ON public.items FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'items.select' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "update items with permissions items.update" ON public.items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'items.update' AND auth.uid() = ur.user_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'items.update' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "insert items with permissions items.insert" ON public.items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'items.insert' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "delete items with permissions items.delete" ON public.items FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_app_roles ur INNER JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id 
      INNER JOIN app_permissions p ON rp.app_permission_id = p.id 
      WHERE p.name = 'items.delete' AND auth.uid() = ur.user_id)
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
    INNER JOIN item_category_views ic ON i.category_id = ic.id;
$$;

CREATE VIEW item_views AS SELECT * FROM fn_item_views();
