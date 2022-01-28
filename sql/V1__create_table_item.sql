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

-- CREATE POLICY "allow all to select item_categories" ON item_categories;

CREATE RECURSIVE VIEW item_category_views (id, name) AS 
SELECT
	id,
	name
FROM
	item_categories
WHERE
	parent_id IS NULL
UNION ALL
	SELECT
		e.id,
		(
			rl.name || ' || ' || e.name
		) AS name
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
