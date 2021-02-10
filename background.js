var Background = /** @class */ (function () {
  function Background() {
      var _this = this;
      this.tabIds = new Map();
      this.sendMessage = function (tabId) {
          chrome.storage.local.get('real_time_youtube_disabled', function (values) {
            var disabled = values.real_time_youtube_disabled;
            chrome.tabs.sendMessage(tabId, {action: "open_dialog_box"});
            console.log("message was send ")
          });
        
      };

      this.enableExtension = function () {
        chrome.browserAction.setIcon({
          path: {
            "24": "res/img/img24.png",
            "32": "res/img/img32.png",
            "48": "res/img/img48.png"
        },
      });
      chrome.tabs.onUpdated.addListener(_this.sendMessage);

        console.log("ON");
      };
      this.disableExtension = function () {
        chrome.browserAction.setIcon({
          path: {
            "24": "res/img/img_dis24.png",
            "32": "res/img/img_dis32.png",
            "48": "res/img/img_dis48.png"
        },
      });
      chrome.tabs.onUpdated.removeListener(_this.sendMessage);
      console.log("OFF");
      _this.tabIds.clear();
      };
      this.saveSettings = function (disabled) {
          chrome.storage.local.set({ real_time_youtube_disabled: disabled }); // eslint-disable-line
      };
      this.tabIds = new Map();
      chrome.storage.local.get('real_time_youtube_disabled', function (values) {
          var disabled = values.real_time_youtube_disabled;
          if (typeof disabled === 'undefined') {
              disabled = false;
              _this.saveSettings(disabled);
            }
      });

  }
  return Background;
}());

var disabled = false;

main();
function main(){
  chrome.browserAction.onClicked.addListener(function () {
        if (disabled) {
            enableExtension();
        }
        else {
            disableExtension();
        }
        disabled = !disabled;
    });
}

function enableExtension() {
  chrome.browserAction.setIcon({
    path: {
      "48": "res/img/LogoIcon24x24@2x.png",
      "88": "res/img/LogoIcon44x44@2x.png",
      "172": "res/img/LogoIcon86x86@2x.png"
    },
  });
  chrome.tabs.query({
      active: true,
      currentWindow: true,
}, function (tabs) {
    if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    }
  });
  console.log("ON");
};



function disableExtension() {
  chrome.browserAction.setIcon({
    path: {
      "48": "res/img/DisLogoIcon24x24@2x.png",
      "88": "res/img/DisLogoIcon44x44@2x.png",
      "172": "res/img/DisLogoIcon86x86@2x.png"
},
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: '*://*.youtube.com/*',
  }, function (tabs) {
  if (tabs.length > 0) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "ON"});
    chrome.tabs.onUpdated.addListener(
      function(tabId, changeInfo, tab) {
        // read changeInfo data
        if (tabId==tabs[0].id) {
          chrome.browserAction.setIcon({
            path: {
              "48": "res/img/LogoIcon24x24@2x.png",
              "88": "res/img/LogoIcon44x44@2x.png",
              "172": "res/img/LogoIcon86x86@2x.png"
            },
          });
        
        }
      }
    );
    
  }
  });
  console.log("OFF");
};
