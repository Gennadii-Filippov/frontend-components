export function dynamicScriptLoader(
  dynamicScriptsData: { scriptUrls: string[]; callback?: () => void; timeout?: number },
  loaderCallback?: () => void
): void {
  //loaderCallback вызывается всегда, callback вызывается только если скрипта не было на странице
  const { scriptUrls, callback, timeout } = dynamicScriptsData;

  const urls = scriptUrls.filter((url) => {
    return !document.querySelector('script[src="' + url + '"]');
  });

  function loadAsync(urls: Array<string>, index: number): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = urls[index] as string;
    script.async = true;
    script.onload = () => {
      if (index === urls.length - 1) {
        callback?.();
        loaderCallback?.();
      } else {
        loadAsync(urls, index + 1);
      }
    };
    document.body.append(script);
  }

  if (urls.length) {
    setTimeout(() => {
      loadAsync(urls, 0);
    }, timeout ?? 0);
  } else {
    loaderCallback?.();
  }
}
