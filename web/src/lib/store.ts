import {writable} from 'svelte/store';

let data;
try {
  data = JSON.parse(localStorage.getItem('user') || 'NULL');
} catch (err) {
  data = null;
}

export const User = (function () {
  const {subscribe, set} = writable(data);
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
