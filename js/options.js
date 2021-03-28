var app = new Vue({
  el: "#app",
  data: () => {
    return {
      corpid: "",
      corpsecret: "",
      agentid: "",
      touser: "@all",
    };
  },
  created: function () {
    var $this = this;
    chrome.storage.sync.get(
      {
        corpid: null,
        corpsecret: null,
        agentid: null,
        touser: null,
      },
      function (items) {
        $this.corpid = items.corpid;
        $this.corpsecret = items.corpsecret;
        $this.agentid = items.agentid;
        $this.touser = items.touser;
      }
    );
  },
  methods: {
    saveOptions() {
      var $this = this;
      chrome.storage.sync.set(
        {
          corpid: $this.corpid,
          corpsecret: $this.corpsecret,
          agentid: $this.agentid,
          touser: $this.touser,
        },
        function () {
          $this.$message.success("设置已保存");
        }
      );
    },
  },
});
