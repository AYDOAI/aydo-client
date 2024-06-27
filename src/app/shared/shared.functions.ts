
export function jsonStringify(value: any, replacer?: any, space?: string | number) {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.log('jsonStringify error');
    console.error(e);
    return '';
  }
}