'use strict'

weixin.getCurrentTabUrl = function (info, tab, callback, done) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];
        callback(tab.title, tab.url, done);
    });
};

weixin.buildMenu = function () {
    chrome.contextMenus.create({
        title: "推送企业微信 » 当前页面链接",
        contexts: ["page"],
        onclick: function (info, tab) {
            weixin.getCurrentTabUrl(info, tab, weixin.postMessage, function (result, err) {
                if (err) {
                    weixin.error(err)
                }
                weixin.log('Done!');
            });
        }
    });

    chrome.contextMenus.create({
        title: "推送企业微信 » 选中文字",
        contexts: ["selection"],
        onclick: function (text) {
            var message = text.selectionText;
            weixin.postMessage(message, null, function (result, err) {
                if (err) {
                    weixin.error(err)
                }
                weixin.log('Done!');
            });
        }
    });

    chrome.contextMenus.create({
        title: "推送企业微信 » 选中图片",
        contexts: ["image"],
        onclick: function (image) {
            var message = image.srcUrl;
            weixin.postMessage( message, null, function (result, err) {
                if (err) {
                    weixin.error(err)
                }
                weixin.log('Done!');
            });
        }
    });

    chrome.contextMenus.create({
        title: "推送企业微信 » 选中链接",
        contexts: ["link"],
        onclick: function (link) {
            var title = link.selectionText;
            var message = link.linkUrl;
            // when title and message is same url, not send message
            if (title.startsWith('http://') || title.startsWith('https://')) {
                title = message;
                message = null;
            }
            weixin.postMessage(title,  message, function (result, err) {
                if (err) {
                    weixin.error(err)
                }
                weixin.log('Done!');
            });
        }
    });
};

weixin.buildMenu();