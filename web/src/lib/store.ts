import {writable} from 'svelte/store';

let user;
try {
  user = JSON.parse(localStorage.getItem('user') || 'NULL');
} catch (err) {
  user = null;
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

export function parseURLQuery(query) {
  return query
    .split('?')
    .slice(-1)[0]
    .split('&')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[v[0]] = v[1];
      return acc;
    }, {});
}

export function urlQueryFilter(param) {
  return Object.entries(param).reduce((acc, [k, v]) => {
    if (k.startsWith('fi:')) {
      acc[k.substring(3)] = v;
    }
    return acc;
  }, {});
}
