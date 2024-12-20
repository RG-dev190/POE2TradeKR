(async function () {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("translateData.js");
    script.type = "text/javascript";
    document.body.appendChild(script);
    console.log("Translation script injected!");
  })();
  