
export function jsonStringify(value: any, replacer?: any, space?: string | number) {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.log('jsonStringify error');
    console.error(e);
    return '';
  }
}

export function between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}