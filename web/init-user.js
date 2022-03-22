import {createClient} from '@supabase/supabase-js';
import * as fs from 'fs';
import {exit} from 'process';

const env = fs
  .readFileSync('.env')
  .toString()
  .split('\n')
  .map(v => v.trim().split('='))
  .reduce((acc, [k, v]) => {
    if (k) {
      acc[k] = v;
    }
    return acc;
  }, {});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

async function createUser({email, password}, retry = 0) {
  const {user, error} = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    if (error.status === 400 && error.message === 'User already registered') {
      console.log({email, ...error});
      return;
    } else if (error.code === 'ECONNREFUSED' && retry < 3) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await createUser({email, password}, retry + 1);
    }
    throw error;
  }
  console.log({user});
}

(async () => {
  await createUser({
    email: 'admin@tokoapp.com',
    password: 'dodol123'
  });
  await createUser({
    email: 'opr@tokoapp.com',
    password: 'dodol123'
  });
  await createUser({
    email: 'user1@tokoapp.com',
    password: 'dodol123'
  });
  await createUser({
    email: 'user2@tokoapp.com',
    password: 'dodol123'
  });
  await createUser({
    email: 'multi@tokoapp.com',
    password: 'dodol123'
  });
})()
  .then(() => console.log('DONE'))
  .catch(err => {
    console.log(err);
    exit(-1);
  });
