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

CREATE POLICY "allow select item_categories to all users" ON public.item_categories FOR SELECT USING (true);

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
CREATE POLICY "allow select items to all users" ON public.items FOR SELECT USING (true);

CREATE VIEW item_views AS
SELECT
  i.*,
  ic.full_name AS category
FROM
  items i 
  INNER JOIN item_category_views ic ON i.category_id = ic.id;