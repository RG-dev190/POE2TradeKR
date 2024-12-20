// GitHub 리포지토리 JSON 파일 URL
const jsonUrls = {
  trade2data: "https://raw.githubusercontent.com/RG-dev190/POE2TradeDataFetch/refs/heads/main/data/static.json",
  trade2filters: "https://raw.githubusercontent.com/RG-dev190/POE2TradeDataFetch/refs/heads/main/data/filters.json",
  trade2stats: "https://raw.githubusercontent.com/RG-dev190/POE2TradeDataFetch/refs/heads/main/data/stats.json",
  trade2items: "https://raw.githubusercontent.com/RG-dev190/POE2TradeDataFetch/refs/heads/main/data/items.json"
};

// 데이터를 가져오고 localStorage에 저장하는 함수
async function fetchAndStoreJson(key, url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch ${key} from ${url}: ${response.statusText}`);
      }

      const data = await response.json(); // JSON 데이터를 파싱
      localStorage.setItem(`lscache-${key}`, JSON.stringify(data)); // localStorage에 저장
      console.log(`Updated localStorage: lscache-${key}`);
  } catch (error) {
      console.error(`Error fetching and storing ${key}:`, error);
  }
}

// 모든 데이터를 가져오고 저장하는 함수
async function updateLocalStorageFromGitHub() {
  for (const [key, url] of Object.entries(jsonUrls)) {
      await fetchAndStoreJson(key, url);
  }
}

// 실행
updateLocalStorageFromGitHub();
