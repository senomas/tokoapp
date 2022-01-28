INSERT INTO item_categories(parent_id, name) VALUES(NULL, 'Tas');
INSERT INTO item_categories(parent_id, name) SELECT id, 'Totebag' FROM item_category_views WHERE name = 'Tas';

INSERT INTO item_categories(parent_id, name) VALUES(NULL, 'Botol Minum');
INSERT INTO item_categories(parent_id, name) SELECT id, 'Tumbler' FROM item_category_views WHERE name = 'Botol Minum';

INSERT INTO items(category_id, name) SELECT id, 'Totebag Starbucks S' FROM item_category_views WHERE name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag Starbucks L' FROM item_category_views WHERE name = 'Tas || Totebag';

INSERT INTO items(category_id, name) SELECT id, 'Tumbler Starbucks 3000ml Kaca' FROM item_category_views WHERE name = 'Botol Minum || Tumbler';
