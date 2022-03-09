import fs from 'fs';
import path from 'path';
import {load} from 'js-yaml';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({params}) {
  let f: string = params.file;
  if (f.endsWith('.json')) {
    f = f.slice(0, -5);
  }
  if (f.endsWith('/')) {
    f = f.slice(0, -1);
  }
  let fn = path.resolve('data', `${f}.yaml`);
  if (fs.existsSync(fn)) {
    return {body: load(fs.readFileSync(fn).toString())};
  } else {
    fn = path.resolve('data', f, 'index.yaml');
    if (fs.existsSync(fn)) {
      return {body: load(fs.readFileSync(fn).toString())};
    }
  }
  return {
    status: 404,
    body: {
      message: `File ${fn} not found`
    }
  };
}
