"use strict";

weixin.onResponse = function (status, body, done) {
  if (status == 200) {
    try {
      done(JSON.parse(body));
    } catch (e) {
      done();
    }
  } else if (status === 401) {
    // sign out
  } else if (status === 400) {
    try {
      done(null, JSON.parse(body).error);
    } catch (e) {
      done();
    }
  } else {
    done();
  }
};

weixin.buildXhr = function (method, url, done) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      weixin.onResponse(xhr.status, xhr.responseText, done);
    }
  };

  return xhr;
};

weixin.postToApi = function (url, object, done) {
  var xhr = weixin.buildXhr("POST", url, done);
  xhr.send(object);
};

weixin.postMessage = function (title, message, done) {
  var $this = this;
  weixin.getAccessToken(function (access_token, err) {
    if (access_token) {
      chrome.storage.sync.get(
        {
          corpid: null,
          corpsecret: null,
          agentid: null,
          touser: null,
        },
        function (items) {
          if (
            items.corpid === null ||
            items.corpid === "" ||
            items.corpsecret === null ||
            items.corpsecret === "" ||
            items.agentid === null ||
            items.agentid === "" ||
            items.touser === null ||
            items.touser === ""
          ) {
            console.error("corpid/corpsecret/agentid/touser参数未配置正确，请到设置页检查配置.");
            done(null, new Error("corpid/corpsecret/agentid/touser参数未配置正确，请到设置页检查配置."));
            return;
          } else {
            var data = {
              touser: items.touser,
              msgtype: "text",
              agentid: items.agentid,
              text: {
                content: title + (message ? "\n" + message : ""),
              },
            };
            var url =
              "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + encodeURIComponent(access_token);
            weixin.postToApi(url, JSON.stringify(data), done);
          }
        }
      );
    } else {
        console.error("access token获取失败.");
        done(null, new Error("access token获取失败."));
    }
  });
};

weixin.getAccessToken = function (done) {
  chrome.storage.sync.get(
    {
      access_token: null,
      expires_time: null,
    },
    function (items) {
      var now = Date.now();
      if (
        items.access_token === null ||
        items.access_token === "" ||
        items.expires_time === null ||
        items.expires_time === "" ||
        now > items.expires_time
      ) {
        weixin.postAccessTokenApi(function (result) {
          if (result && result.errcode === 0) {
            items.access_token = result.access_token;
            items.expires_time = now + result.expires_in * 1000;
            chrome.storage.sync.set(
              {
                access_token: items.access_token,
                expires_time: items.expires_time,
              },
              function () {
                done(items.access_token);
              }
            );
          } else {
            console.error("access token获取失败.");
            done(null, new Error("access token获取失败."));
          }
        });
      } else {
        done(items.access_token);
      }
    }
  );
};

weixin.postAccessTokenApi = function (done) {
  chrome.storage.sync.get(
    {
      access_token: null,
      expires_time: null,
      corpid: null,
      corpsecret: null,
    },
    function (items) {
      if (items.corpid === null || items.corpid === "" || items.corpsecret === null || items.corpsecret === "") {
        $this.$message("No corpid / corpsecret configured. Please set one in Options.", 4000);
      } else {
        var url =
          "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" +
          encodeURIComponent(items.corpid) +
          "&corpsecret=" +
          encodeURIComponent(items.corpsecret);
        var xhr = weixin.buildXhr("GET", url, done);
        xhr.send();
      }
    }
  );
};
