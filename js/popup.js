var app = new Vue({
  el: "#app",
  data: () => {
    return {
      form: {
        title: "",
        message: "",
      },
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
      },
    };
  },
  created: function () {},
  methods: {
    submit() {
      var $this = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          weixin.postMessage(this.form.title, this.form.message, function (resp, err) {
            if (err) {
              $this.$message.error(err.message);
            } else {
              $this.$message.success("已发送!");
            }
          });
        } else {
          return false;
        }
      });
    },
    goPopoutLink() {
      chrome.tabs.create({ url: "popup.html" });
    },
    goOptionsLink() {
      chrome.tabs.create({ url: "options.html" });
    },
  },
});
