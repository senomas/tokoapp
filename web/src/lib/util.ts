export function parseURLQuery(query) {
  return query
    .split('?')
    .slice(-1)[0]
    .split('&')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      if (k) {
        acc[k] = v;
      }
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

export function cl(value) {
  if (Array.isArray(value)) {
    return value.filter(v => !!v).join(' ');
  }
  return value;
}
