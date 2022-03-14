import {writable} from 'svelte/store';
import {load} from 'js-yaml';

let user;
try {
  user = JSON.parse(sessionStorage.getItem('user') || 'NULL');
} catch (err) {
  user = null;
}

let theme;
try {
  theme = JSON.parse(sessionStorage.getItem('theme') || '{}');
} catch (err) {
  theme = {};
}

export const User = (function () {
  const {subscribe, set} = writable(user);
  return {
    subscribe,
    signout: () => {
      set(null);
    },
    signin: session => {
      set(session);
    }
  };
})();

export const Theme = (function () {
  const {subscribe, set} = writable(theme);
  return {
    subscribe,
    set
  };
})();

async function loadIncludes(v: any) {
  if (!v) {
    return v;
  }
  if (Array.isArray(v)) {
    const r = [];
    for (const cv of v) {
      r.push(await loadIncludes(cv));
    }
    return r;
  } else if (typeof v === 'object') {
    const r = {};
    for (const [ck, cv] of Object.entries(v)) {
      if (ck === '@include') {
        if (Array.isArray(cv)) {
          for (const cvv of cv) {
            const res = await fetch(cvv as string, {
              headers: {Accept: 'text/yaml'}
            });
            if (
              res.status === 200 &&
              res.headers.get('content-type') === 'text/yaml'
            ) {
              const text = await res.text();
              for (const [lk, lv] of Object.entries(load(text))) {
                r[lk] = lv;
              }
            }
          }
        } else {
          const res = await fetch(cv as string, {
            headers: {Accept: 'text/yaml'}
          });
          if (
            res.status === 200 &&
            res.headers.get('content-type') === 'text/yaml'
          ) {
            const text = await res.text();
            for (const [lk, lv] of Object.entries(load(text))) {
              r[lk] = lv;
            }
          }
        }
      } else {
        r[ck] = await loadIncludes(cv);
      }
    }
    return r;
  }
  return v;
}

export async function loadConfig(file: string) {
  let data;
  let res = await fetch(file, {headers: {Accept: 'text/yaml'}});
  if (res.status === 200 && res.headers.get('content-type') === 'text/yaml') {
    const text = await res.text();
    data = load(text);
  } else if (!file.endsWith('.yaml')) {
    file = file + '/index.yaml';
    res = await fetch(file, {headers: {Accept: 'text/yaml'}});
    if (res.status === 200 && res.headers.get('content-type') === 'text/yaml') {
      const text = await res.text();
      data = load(text);
    }
  }
  data = await loadIncludes(data);
  return data;
}
