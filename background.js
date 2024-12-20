chrome.action.onClicked.addListener(async () => {
    const initialUrl = "https://poe.game.daum.net"; // 초기 URL
    const loginUrl = "https://poe.game.daum.net/login/transfer?redir=%2F"; // 로그인 전환 URL
    const finalUrl = "https://www.pathofexile.com/trade2/search/poe2/Standard"; // 최종 URL

    // Step 1: initialUrl로 이동
    chrome.tabs.create({ url: initialUrl }, (tab) => {
        console.log(`Navigating to ${initialUrl}...`);

        // Step 2: 로딩 완료 후 쿠키 가져오기
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener); // Clean up listener
                console.log(`${initialUrl} loaded. Retrieving cookies...`);

                // 모든 쿠키 가져오기
                chrome.cookies.getAll({ domain: "poe.game.daum.net" }, (cookies) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error retrieving cookies:", chrome.runtime.lastError.message);
                        return;
                    }

                    if (!cookies || cookies.length === 0) {
                        console.warn("No cookies found for poe.game.daum.net.");
                        alert("No cookies available for the domain.");
                        return;
                    }

                    // 쿠키를 "key=value" 형태로 조합
                    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");
                    console.log("Retrieved cookies:", cookieString);

                    // Step 3: 로그인 URL로 이동 및 쿠키 주입
                    chrome.tabs.update(tabId, { url: loginUrl }, () => {
                        console.log(`Navigating to ${loginUrl}...`);

                        chrome.tabs.onUpdated.addListener(function listener2(tabId2, changeInfo2) {
                            if (tabId2 === tab.id && changeInfo2.status === "complete") {
                                chrome.tabs.onUpdated.removeListener(listener2); // Clean up listener
                                console.log(`${loginUrl} loaded. Injecting cookies...`);

                                // 쿠키 주입
                                chrome.scripting.executeScript({
                                    target: { tabId: tab.id },
                                    func: (cookieString) => {
                                        document.cookie = cookieString;
                                        console.log("Injected cookies:", document.cookie);
                                    },
                                    args: [cookieString],
                                }).then(() => {
                                    console.log("Cookies injected successfully.");

                                    // Step 4: 최종 URL로 이동
                                    chrome.tabs.update(tabId, { url: finalUrl }, () => {
                                        console.log(`Navigated to final URL: ${finalUrl}`);
                                    });
                                }).catch(err => {
                                    console.error("Error injecting cookies:", err);
                                });
                            }
                        });
                    });
                });
            }
        });
    });
});
