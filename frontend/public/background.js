/* eslint-disable */
const vault = new Map();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == 'getAccount') {
    if (vault != null && vault.has(request.domain) && vault.get(request.domain).length > 0) {
      let passwords = vault.get(request.domain);
      sendResponse({
        data: {
          username: passwords[0].uname,
          password: passwords[0].pwd,
        },
      });
    } else {
      sendResponse({ data: { username: '', password: '' } });
    }
  }
});

function setVaultInstance(vault) {
  console.log('received vault', vault);
  vault = vault;
}
