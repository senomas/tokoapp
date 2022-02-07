DROP TABLE IF EXISTS item_categories CASCADE;
DROP VIEW IF EXISTS item_category_views CASCADE;
DROP TABLE IF EXISTS items CASCADE;

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

CREATE POLICY "select item_categories to all users" ON public.item_categories FOR SELECT USING (true);
CREATE POLICY "update item_categories with privileges item_categories.update" ON public.item_categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'item_categories.update' AND auth.uid() = ur.user_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'item_categories.update' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "insert item_categories with privileges item_categories.insert" ON public.item_categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'item_categories.insert' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "delete item_categories with privileges item_categories.delete" ON public.item_categories FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'item_categories.delete' AND auth.uid() = ur.user_id)
  );

CREATE RECURSIVE VIEW item_category_views (id, parent_id, parent, name, full_name, description, created_at, created_by, updated_at, updated_by) AS 
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
    rl.name || ' || ' || e.name AS full_name,
    e.description,
    e.created_at,
    e.created_by,
    e.updated_at,
    e.updated_by
	FROM
		item_categories e
	INNER JOIN item_category_views rl ON e.parent_id = rl.id;

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
CREATE POLICY "select items to all users" ON public.items FOR SELECT USING (true);
CREATE POLICY "update items with privileges items.update" ON public.items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'items.update' AND auth.uid() = ur.user_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'items.update' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "insert items with privileges items.insert" ON public.items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'items.insert' AND auth.uid() = ur.user_id)
  );
CREATE POLICY "delete items with privileges items.delete" ON public.items FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles ur INNER JOIN role_privileges rp ON ur.role_id = rp.role_id 
      INNER JOIN privileges p ON rp.privilege_id = p.id 
      WHERE p.name = 'items.delete' AND auth.uid() = ur.user_id)
  );

CREATE VIEW item_views AS
SELECT
  i.*,
  ic.full_name AS category
FROM
  items i 
  INNER JOIN item_category_views ic ON i.category_id = ic.id;