DROP TABLE IF EXISTS app_roles CASCADE;
DROP TABLE IF EXISTS app_role_permissions CASCADE;
DROP TABLE IF EXISTS app_permissions CASCADE;
DROP TABLE IF EXISTS user_app_roles CASCADE;
DROP VIEW  IF EXISTS user_views CASCADE;
DROP FUNCTION  IF EXISTS fn_user_views CASCADE;

DROP FUNCTION IF EXISTS fn_item_category_views CASCADE;
DROP FUNCTION IF EXISTS fn_item_category_views CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP VIEW IF EXISTS item_category_views CASCADE;
DROP FUNCTION IF EXISTS fn_item_views CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP VIEW IF EXISTS item_views CASCADE;