INSERT INTO app_roles (name) VALUES ('super_admin');
INSERT INTO app_roles (name) VALUES ('admin');
INSERT INTO app_roles (name) VALUES ('operator');
INSERT INTO app_roles (name) VALUES ('user');






INSERT INTO app_permissions (name) VALUES ('app_roles.select');
INSERT INTO app_permissions (name) VALUES ('app_roles.update');
INSERT INTO app_permissions (name) VALUES ('app_roles.insert');
INSERT INTO app_permissions (name) VALUES ('app_roles.delete');

INSERT INTO app_permissions (name) VALUES ('app_permissions.select');
INSERT INTO app_permissions (name) VALUES ('app_permissions.update');
INSERT INTO app_permissions (name) VALUES ('app_permissions.insert');
INSERT INTO app_permissions (name) VALUES ('app_permissions.delete');

INSERT INTO app_permissions (name) VALUES ('users.select');
INSERT INTO app_permissions (name) VALUES ('users.update');
INSERT INTO app_permissions (name) VALUES ('users.insert');
INSERT INTO app_permissions (name) VALUES ('users.delete');

INSERT INTO app_permissions (name) VALUES ('items.select');
INSERT INTO app_permissions (name) VALUES ('items.update');
INSERT INTO app_permissions (name) VALUES ('items.insert');
INSERT INTO app_permissions (name) VALUES ('items.delete');

INSERT INTO app_permissions (name) VALUES ('item_categories.select');
INSERT INTO app_permissions (name) VALUES ('item_categories.update');
INSERT INTO app_permissions (name) VALUES ('item_categories.insert');
INSERT INTO app_permissions (name) VALUES ('item_categories.delete');

INSERT INTO app_role_permissions(app_role_id, app_permission_id) SELECT r.id as uid, p.id as pid FROM app_roles r, app_permissions p WHERE r.name = 'admin';
INSERT INTO app_role_permissions(app_role_id, app_permission_id) SELECT r.id as uid, p.id as pid FROM app_roles r, app_permissions p WHERE r.name = 'operator' AND NOT(p.name LIKE '%.delete');
INSERT INTO app_role_permissions(app_role_id, app_permission_id) SELECT r.id as uid, p.id as pid FROM app_roles r, app_permissions p WHERE r.name = 'user' AND p.name LIKE '%.select';
 
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'super_admin@tokoapp.com' AND (r.name = 'super_admin');
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'admin@tokoapp.com' AND (r.name = 'admin');
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'admin2@tokoapp.com' AND r.name = 'admin';
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'opr@tokoapp.com' AND r.name = 'operator';
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'user1@tokoapp.com' AND r.name = 'user';
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'user2@tokoapp.com' AND r.name = 'user';

INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'multi@tokoapp.com' AND r.name = 'admin';
INSERT INTO user_app_roles(user_id, app_role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, app_roles r WHERE u.email = 'multi@tokoapp.com' AND r.name = 'operator';
