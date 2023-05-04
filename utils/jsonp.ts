function jsonp(url: string, callback: (data: any) => void): void {
    const callbackName = "jsonp_" + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.head.removeChild(script);
      callback(data);
    };
  
    const script = document.createElement("script");
    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + callbackName;
    document.head.appendChild(script);
  }
  
  export default jsonp;
  