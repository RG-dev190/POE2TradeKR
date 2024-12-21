chrome.action.onClicked.addListener(async () => {
    const initialUrl = "https://poe.game.daum.net"; // 초기 URL
    const loginUrl = "https://poe.game.daum.net/login/transfer?redir=%2Fmy-account"; // 로그인 전환 URL
    const finalUrl = "https://www.pathofexile.com/trade2/search/poe2/Standard"; // 최종 URL

    // Step 0: https://www.pathofexile.com 쿠키 삭제
    const targetDomain = "www.pathofexile.com";
    const targetProtocol = "https";

    chrome.cookies.getAll({ domain: targetDomain }, (cookies) => {
        if (!cookies || cookies.length === 0) {
            console.log(`No cookies found for domain: ${targetDomain}`);
        } else {
            console.log(`Found ${cookies.length} cookies for domain: ${targetDomain}. Deleting...`);
            cookies.forEach((cookie) => {
                const cookieUrl = `${targetProtocol}://${cookie.domain.startsWith(".") ? cookie.domain.substring(1) : cookie.domain}${cookie.path}`;
                chrome.cookies.remove({ url: cookieUrl, name: cookie.name }, (details) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Error removing cookie: ${cookie.name}`, chrome.runtime.lastError.message);
                    } else {
                        console.log(`Cookie removed: ${details.name}`);
                    }
                });
            });
        }

        // Step 1: initialUrl로 이동
        chrome.tabs.create({ url: initialUrl }, (tab) => {
            console.log(`Navigating to ${initialUrl}...`);

            // Step 2: initialUrl 로드 완료 확인
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener); // Clean up listener
                    console.log(`${initialUrl} loaded. Navigating to login URL...`);

                    // Step 3: loginUrl로 이동
                    chrome.tabs.update(tabId, { url: loginUrl }, () => {
                        console.log(`Navigating to ${loginUrl}...`);

                        // Step 4: 5초 대기 후 로드 상태 확인
                        setTimeout(() => {
                            console.log("5 seconds passed. Checking if loginUrl is loaded...");

                            // Step 5: loginUrl 로드 완료 확인
                            chrome.scripting.executeScript(
                                {
                                    target: { tabId: tabId },
                                    func: () => document.readyState
                                },
                                (result) => {
                                    if (chrome.runtime.lastError) {
                                        console.error("Error checking page readyState:", chrome.runtime.lastError.message);
                                        return;
                                    }

                                    if (result && result[0].result === "complete") {
                                        console.log(`${loginUrl} is fully loaded. Navigating to final URL...`);

                                        // Step 6: finalUrl로 이동
                                        chrome.tabs.update(tabId, { url: finalUrl }, () => {
                                            console.log(`Navigated to final URL: ${finalUrl}`);

                                            // Step 7: 새로고침
                                            setTimeout(() => {
                                                chrome.tabs.reload(tabId, () => {
                                                    console.log(`Final URL reloaded: ${finalUrl}`);
                                                });
                                            }, 2000); // 2초 후 새로고침
                                        });
                                    } else {
                                        console.warn(`${loginUrl} is not fully loaded yet. Please check again.`);
                                    }
                                }
                            );
                        }, 5000); // 5초 대기
                    });
                }
            });
        });
    });
});
