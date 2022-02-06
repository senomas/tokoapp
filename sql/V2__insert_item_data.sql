INSERT INTO item_categories(parent_id, name) VALUES(NULL, 'Tas');
INSERT INTO item_categories(parent_id, name) SELECT id, 'Totebag' FROM item_category_views WHERE full_name = 'Tas';

INSERT INTO item_categories(parent_id, name) VALUES(NULL, 'Botol Minum');
INSERT INTO item_categories(parent_id, name) SELECT id, 'Tumbler' FROM item_category_views WHERE full_name = 'Botol Minum';

INSERT INTO items(category_id, name) SELECT id, 'Totebag Starbucks S' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag Starbucks L' FROM item_category_views WHERE full_name = 'Tas || Totebag';

INSERT INTO items(category_id, name) SELECT id, 'Tumbler Starbucks 3000ml Kaca' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';



-- DUMMY
INSERT INTO items(category_id, name) SELECT id, 'Botol 1' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 2' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 3' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 4' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 5' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 6' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 7' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 8' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 9' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 10' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 11' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 12' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 13' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 14' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 15' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 17' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 18' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 19' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 20' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 21' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 22' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 23' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 24' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 25' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 27' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 28' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 29' FROM item_category_views WHERE full_name = 'Botol Minum';
INSERT INTO items(category_id, name) SELECT id, 'Botol 30' FROM item_category_views WHERE full_name = 'Botol Minum';

INSERT INTO items(category_id, name) SELECT id, 'Tumbler 1' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 2' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 3' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 4' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 5' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 6' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 7' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 8' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 9' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 10' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 11' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 12' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 13' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 14' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 15' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 17' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 18' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 19' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 20' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 21' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 22' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 23' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 24' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 25' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 27' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 28' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 29' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';
INSERT INTO items(category_id, name) SELECT id, 'Tumbler 30' FROM item_category_views WHERE full_name = 'Botol Minum || Tumbler';

INSERT INTO items(category_id, name) SELECT id, 'Tas 1' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 2' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 3' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 4' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 5' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 6' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 7' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 8' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 9' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 10' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 11' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 12' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 13' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 14' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 15' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 17' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 18' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 19' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 20' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 21' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 22' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 23' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 24' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 25' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 27' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 28' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 29' FROM item_category_views WHERE full_name = 'Tas';
INSERT INTO items(category_id, name) SELECT id, 'Tas 30' FROM item_category_views WHERE full_name = 'Tas';

INSERT INTO items(category_id, name) SELECT id, 'Totebag 1' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 2' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 3' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 4' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 5' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 6' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 7' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 8' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 9' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 10' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 11' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 12' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 13' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 14' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 15' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 17' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 18' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 19' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 20' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 21' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 22' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 23' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 24' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 25' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 27' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 28' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 29' FROM item_category_views WHERE full_name = 'Tas || Totebag';
INSERT INTO items(category_id, name) SELECT id, 'Totebag 30' FROM item_category_views WHERE full_name = 'Tas || Totebag';
