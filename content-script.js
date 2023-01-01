const setDebug = ({ namespace = "" } = {}) => {
  const namespaceString = namespace
    .split(/[\s\n,]/)
    .filter((i) => i)
    .join(",");
  localStorage.debug = namespaceString;
  const sendMessageToSW = () => {
    navigator.serviceWorker.controller.postMessage({
      type: "ENABLE_DEBUG",
      payload: { namespace: namespaceString },
    });
  };
  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener("controllerchange", (event) => {
      sendMessageToSW();
    });
  } else {
    sendMessageToSW();
  }
};
const syncNamespace = async () => {
  const { namespace = "" } = await chrome.storage.sync.get(["namespace"]);
  console.log("namespace@content-script", namespace);
  setDebug({ namespace });
};
const main = async () => {
  console.log("main@content-scripts");
  chrome.storage.onChanged.addListener(async (changes) => {
    syncNamespace();
  });
  syncNamespace();
};

main();
