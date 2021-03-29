var app = new Vue({
  el: "#app",
  data: () => {
    return {
      form: {
        corpid: "",
        corpsecret: "",
        agentid: "",
        touser: "",
      },
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
        $this.form.corpid = items.corpid;
        $this.form.corpsecret = items.corpsecret;
        $this.form.agentid = items.agentid;
        $this.form.touser = items.touser || "@all";
      }
    );
  },
  methods: {
    saveOptions() {
      var $this = this;
      chrome.storage.sync.set(
        {
          corpid: $this.form.corpid,
          corpsecret: $this.form.corpsecret,
          agentid: $this.form.agentid,
          touser: $this.form.touser,
        },
        function () {
          $this.$message.success("设置已保存");
        }
      );
    },
  },
});
