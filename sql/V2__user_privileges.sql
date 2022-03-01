CREATE TABLE app_roles (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  description TEXT
);

CREATE VIEW user_permission_views AS 
SELECT u.id, u.email email, 'none' as role, 'none' as permission FROM auth.users u;

ALTER TABLE app_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select app_roles with permissions app_roles.select" ON app_roles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update app_roles with permissions app_roles.update" ON app_roles FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert app_roles with permissions app_roles.insert" ON app_roles FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete app_roles with permissions app_roles.delete" ON app_roles FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.delete') AND auth.uid() = u.id
    )
  );

CREATE TABLE app_permissions (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  description TEXT
);

ALTER TABLE app_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select app_permissions with permissions app_permissions.select" ON app_permissions FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_permissions.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update app_permissions with permissions app_permissions.update" ON app_permissions FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_permissions.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_permissions.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert app_permissions with permissions app_permissions.insert" ON app_permissions FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_permissions.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete app_permissions with permissions app_permissions.delete" ON app_permissions FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_permissions.delete') AND auth.uid() = u.id
    )
  );


CREATE TABLE user_app_roles (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  user_id UUID REFERENCES auth.users,
  app_role_id INT REFERENCES app_roles,
  CONSTRAINT user_app_roles_link UNIQUE(user_id, app_role_id)
);

ALTER TABLE user_app_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select user_app_roles with permissions users.select" ON user_app_roles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR user_id = auth.uid() OR u.permission = 'users.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update user_app_roles with permissions users.update" ON user_app_roles FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR user_id = auth.uid() OR u.permission = 'users.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR user_id = auth.uid() OR u.permission = 'users.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert user_app_roles with permissions users.insert" ON user_app_roles FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'users.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete user_app_roles with permissions users.delete" ON user_app_roles FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'users.delete') AND auth.uid() = u.id
    )
  );


CREATE TABLE app_role_permissions (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  app_role_id INT REFERENCES app_roles,
  app_permission_id INT REFERENCES app_permissions,
  CONSTRAINT app_role_permissions_link UNIQUE(app_role_id, app_permission_id)
);

ALTER TABLE app_role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select app_role_permissions with permissions app_roles.select" ON app_role_permissions FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.select') AND auth.uid() = u.id
    )
  );
CREATE POLICY "update app_role_permissions with permissions app_roles.update" ON app_role_permissions FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.update') AND auth.uid() = u.id
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.update') AND auth.uid() = u.id
    )
  );
CREATE POLICY "insert app_role_permissions with permissions app_roles.insert" ON app_role_permissions FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.insert') AND auth.uid() = u.id
    )
  );
CREATE POLICY "delete app_role_permissions with permissions app_roles.delete" ON app_role_permissions FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_permission_views u 
      WHERE (u.role = 'super_admin' OR u.permission = 'app_roles.delete') AND auth.uid() = u.id
    )
  );



CREATE FUNCTION fn_user_views()
RETURNS TABLE (
  instance_id UUID,
  id UUID,
  email VARCHAR,
  roles TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    u.instance_id,
    u.id,
    u.email,
    ur.roles,
    u.created_at,
    u.updated_at
  FROM
    auth.users u LEFT JOIN (
      SELECT u.user_id, string_agg(r.name, ' || ') AS roles FROM user_app_roles u, app_roles r WHERE u.app_role_id = r.id GROUP BY u.user_id
    ) ur ON u.id = ur.user_id;
$$;

CREATE VIEW user_views AS SELECT * FROM fn_user_views();



CREATE OR REPLACE VIEW user_permission_views AS 
SELECT u.id, u.email email, r.name as role, p.name as permission FROM auth.users u INNER JOIN user_app_roles ur ON u.id = ur.user_id
      INNER JOIN app_roles r ON ur.app_role_id = r.id
      LEFT JOIN app_role_permissions rp ON ur.app_role_id = rp.app_role_id
      LEFT JOIN app_permissions p ON rp.app_permission_id = p.id;
