const isDev = import.meta.env.DEV;

const noop = () => {};

export const logger = {
  debug: isDev ? console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: isDev ? console.error.bind(console) : noop,
};
