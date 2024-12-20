chrome.action.onClicked.addListener(async () => {
  const allowedUrl = "https://poe.game.daum.net/trade2/search/poe2/Standard";

  // 거래소 열림 확인
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (activeTab && activeTab.url.startsWith(allowedUrl)) {
      console.log("Extension is clicked on the allowed page.");
      
      // 새 탭 열어 해외 거래소로 이동
      const url = "https://poe.game.daum.net/login/transfer?redir=%2Ftrade2";
      const tab = await chrome.tabs.create({ url });

      // 페이지 로드 완료 대기 후 스크립트 인젝트
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener); // Clean up listener
              chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ["content.js"]
              }).then(() => {
                  console.log("Script injected successfully.");
              }).catch(err => console.error("Failed to inject script:", err));
          }
      });

      // 새로고침을 위한 딜레이 2초
      setTimeout(() => {
          chrome.tabs.reload(tab.id, () => {
              console.log("Tab reloaded successfully!");
          });
      }, 2000);
  } else {
      console.error("The extension is not allowed to be clicked on this page.");
      alert("This extension only works on the allowed page.");
  }
});
