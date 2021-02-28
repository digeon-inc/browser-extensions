const API_URL = 'http://localhost:4000/graphql';

const getRegisteredUrls = () => {
  // 自動ログインに対応したWebサイトのURLを取得する処理を書く。
  const registeredUrls = [
    'https://id.nikkei.com/lounge/nl/auth/bpgw/LA0310.seam',
    'https://id.nikkei.com/lounge/nl/connect/page/LA7010.seam',
  ];

  return registeredUrls;
};

const REGISTERED_URLS = getRegisteredUrls();

const isRegistered = (url) => {
  return REGISTERED_URLS.includes(url);
};

const getLoginDomByUrl = async (url) => {
  const requestBody = {
    query: `
      query getLoginnDomByUrl($url: ID!){
        getLoginDomByUrl(url: $url) {
          url
          name
          idXPath
          pwXPath
          submitXPath
        }
      }`,
    variables: {
      url: url,
    },
  };
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const responseBody = await res.json();
    const loginDoms = responseBody.data.getLoginDomByUrl;
    return loginDoms;
  } catch (error) {
    console.log(error);
  }
};

const getCredential = async (token, url) => {
  const requestBody = {
    query: `
      query getCredential($input: GetCredentialInput!){
        getCredential(input: $input) {
          userID
          userPW
        }
      }`,
    variables: {
      input: { extensionUserID: token, url: url },
    },
  };
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const responseBody = await res.json();
    const credential = responseBody.data.getCredential;
    return credential;
  } catch (error) {
    console.log(error);
  }
};

const login = async (tabs) => {
  const token = localStorage.getItem('token');
  let url = tabs[0].url;
  // クエリパラメータを除外
  url = url.replace(/\?.*$/, '');
  if (!isRegistered(url)) {
    console.log('This website is not registered.');
    return;
  }
  const loginDoms = await getLoginDomByUrl(url);
  console.log(loginDoms);
  if (!loginDoms) {
    console.log('loginDoms is null.');
    return;
  }
  const credential = await getCredential(token, url);
  console.log(credential);
  if (!credential) {
    console.log('credential is null.');
    return;
  }
  chrome.tabs.sendMessage(tabs[0].id, { loginDoms, credential });
};

const main = () => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
      chrome.tabs.query({ active: true, currentWindow: true }, login);
    }
  });
};
main();