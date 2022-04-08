const cache = new Map<string, Promise<Event>>();

export default function loadScript(src: string, callback = (e?: Error) => {}) {
  let p = cache.get(src);
  if (!p) {
    p = new Promise<Event>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = function (e) {
        resolve(e);
      };
      script.onerror = function (
        event: Event | string,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error,
      ) {
        cache.delete(src);
        reject(error);
      };
      document.body.appendChild(script);
    });
    cache.set(src, p);
  }

  return p
    .then(() => {
      callback();
    })
    .catch((err) => {
      callback(err);
    });
}
