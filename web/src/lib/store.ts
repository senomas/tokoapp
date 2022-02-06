import { writable } from 'svelte/store';

export const User = function () {
	const { subscribe, set } = writable(JSON.parse(localStorage.getItem("user") || "NULL"));
  return {
    subscribe,
    signout: () => { set(null) },
		signin:  (session) => { set(session) }
	}
}()