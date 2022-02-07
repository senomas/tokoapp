DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS role_privileges CASCADE;
DROP TABLE IF EXISTS privileges CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

CREATE TABLE roles (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  description TEXT
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow select roles to all users" ON public.roles FOR SELECT USING (true);
CREATE POLICY "allow update roles to users based on email" ON public.roles FOR UPDATE USING (auth.email() LIKE '%@senomas.com') WITH CHECK (auth.email() = 'agus@senomas.com');
CREATE POLICY "allow insert roles to users based on email" ON public.roles FOR INSERT WITH CHECK (auth.email() LIKE '%@senomas.com');
CREATE POLICY "allow delete roles to users based on email" ON public.roles FOR DELETE USING (auth.email() LIKE '%@senomas.com');

CREATE TABLE privileges (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  description TEXT
);

ALTER TABLE privileges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow select privileges to all users" ON public.privileges FOR SELECT USING (true);
CREATE POLICY "allow update privileges to users based on email" ON public.privileges FOR UPDATE USING (auth.email() LIKE '%@senomas.com') WITH CHECK (auth.email() = 'agus@senomas.com');
CREATE POLICY "allow insert privileges to users based on email" ON public.privileges FOR INSERT WITH CHECK (auth.email() LIKE '%@senomas.com');
CREATE POLICY "allow delete privileges to users based on email" ON public.privileges FOR DELETE USING (auth.email() LIKE '%@senomas.com');


CREATE TABLE user_roles (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  user_id UUID REFERENCES auth.users,
  role_id INT REFERENCES roles,
  CONSTRAINT user_roles_link UNIQUE(user_id, role_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow select user_roles to all users" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "allow update user_roles to users based on email" ON public.user_roles FOR UPDATE USING (auth.email() LIKE '%@senomas.com') WITH CHECK (auth.email() = 'agus@senomas.com');
CREATE POLICY "allow insert user_roles to users based on email" ON public.user_roles FOR INSERT WITH CHECK (auth.email() LIKE '%@senomas.com');
CREATE POLICY "allow delete user_roles to users based on email" ON public.user_roles FOR DELETE USING (auth.email() LIKE '%@senomas.com');


CREATE TABLE role_privileges (
  id SERIAL NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users,
  role_id INT REFERENCES roles,
  privilege_id INT REFERENCES privileges,
  CONSTRAINT role_privileges_link UNIQUE(role_id, privilege_id)
);

ALTER TABLE role_privileges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow select role_privileges to all users" ON public.role_privileges FOR SELECT USING (true);
CREATE POLICY "allow update role_privileges to users based on email" ON public.role_privileges FOR UPDATE USING (auth.email() LIKE '%@senomas.com') WITH CHECK (auth.email() = 'agus@senomas.com');
CREATE POLICY "allow insert role_privileges to users based on email" ON public.role_privileges FOR INSERT WITH CHECK (auth.email() LIKE '%@senomas.com');
CREATE POLICY "allow delete role_privileges to users based on email" ON public.role_privileges FOR DELETE USING (auth.email() LIKE '%@senomas.com');

INSERT INTO roles (name) VALUES ('admin');

INSERT INTO privileges (name) VALUES ('items.update');
INSERT INTO privileges (name) VALUES ('items.insert');
INSERT INTO privileges (name) VALUES ('items.delete');
INSERT INTO privileges (name) VALUES ('item_categories.update');
INSERT INTO privileges (name) VALUES ('item_categories.insert');
INSERT INTO privileges (name) VALUES ('item_categories.delete');

INSERT INTO role_privileges(role_id, privilege_id) SELECT r.id as uid, p.id as pid FROM roles r, privileges p WHERE r.name = 'admin';

INSERT INTO user_roles(user_id, role_id) SELECT u.id as uid, r.id as rid FROM auth.users u, roles r WHERE u.email = 'agus@senomas.com' AND r.name = 'admin';
