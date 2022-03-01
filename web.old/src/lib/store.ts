import {writable} from 'svelte/store';

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
