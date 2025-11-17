<template>
  <view class="editor-page">
    <!-- 顶部导航栏（微信原生导航风格） -->
    <view class="editor-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">←</text>
        <text class="header-title">编辑项目内容</text>
      </view>
      <view class="header-right" @click="saveContent">
        <text class="save-text">保存</text>
      </view>
    </view>

    <!-- 工具栏（微信官方editor推荐样式） -->
    <view class="toolbar">
      <button class="toolbar-btn" @click="format('bold')">
        <text class="icon">B</text>
      </button>
      <button class="toolbar-btn" @click="format('italic')">
        <text class="icon">I</text>
      </button>
      <button class="toolbar-btn" @click="format('underline')">
        <text class="icon">U</text>
      </button>
      <view class="toolbar-separator"></view>
      <button class="toolbar-btn" @click="insertImage">
        <text class="icon">🖼</text>
      </button>
      <button class="toolbar-btn" @click="insertLink">
        <text class="icon">🔗</text>
      </button>
      <button class="toolbar-btn" @click="format('clear')">
        <text class="icon">清除</text>
      </button>
    </view>

    <!-- 微信官方editor组件（移除v-model，增加id用于获取上下文） -->
    <editor
      class="editor-content"
      id="editor"
      :read-only="false"
      :placeholder="'请输入项目内容...'"
      @input="onInput"
      @ready="onEditorReady"
    ></editor>

    <!-- 底部字数统计 -->
    <view class="word-count">
      <text>{{ wordCount }} / 5000</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      richContent: "", // 富文本内容（HTML格式）
      wordCount: 0, // 字数统计
      editorCtx: null, // editor上下文
      initialContent: "", // 初始化内容暂存
    };
  },
  onLoad(options) {
    // 接收初始内容（支持HTML格式）
    if (options.content) {
      this.initialContent = decodeURIComponent(options.content);
    }
  },
  methods: {
    // 初始化editor上下文
    onEditorReady() {
      const that = this;
      wx.createSelectorQuery()
        .select("#editor")
        .context(function (res) {
          that.editorCtx = res.context;
          // 初始化内容（如果有）
          if (that.initialContent) {
            that.editorCtx.setContents({
              html: that.initialContent,
              success() {
                that.wordCount = that.calculateWordCount(that.initialContent);
              },
            });
          }
        })
        .exec();
    },

    // 格式化文本（加粗/斜体等）
    format(command) {
      this.editorCtx.format(command);
    },

    // 插入图片
    insertImage() {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          // 实际项目中需上传图片到服务器，这里用临时路径演示
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            alt: "项目图片",
            success() {
              console.log("图片插入成功");
            },
          });
        },
      });
    },

    // 插入链接
    insertLink() {
      const that = this;
      wx.showModal({
        title: "插入链接",
        content: "请输入链接和文字",
        editable: true,
        placeholderText: "格式：文字|链接",
        success(res) {
          if (res.confirm && res.content) {
            const [text, url] = res.content.split("|");
            if (text && url) {
              that.editorCtx.insertLink({
                url,
                text,
                success() {
                  console.log("链接插入成功");
                },
              });
            } else {
              wx.showToast({
                title: "格式错误（例：官网|https://）",
                icon: "none",
              });
            }
          }
        },
      });
    },

    // 监听输入变化
    onInput(e) {
      this.richContent = e.detail.html;
      this.wordCount = this.calculateWordCount(this.richContent);

      // 限制最大字数
      if (this.wordCount > 5000) {
        // 截断内容（简易处理，实际需更精确的截断逻辑）
        this.editorCtx.setContents({
          html: this.richContent.substring(0, 5000),
        });
        wx.showToast({
          title: "内容不能超过5000字",
          icon: "none",
        });
      }
    },

    // 计算纯文本字数（过滤HTML标签）
    calculateWordCount(html) {
      const text = html.replace(/<[^>]+>/g, ""); // 移除HTML标签
      return text.length;
    },

    // 返回上一页
    goBack() {
      wx.navigateBack({ delta: 1 });
    },

    // 保存内容并返回
    saveContent() {
      if (this.wordCount > 5000) {
        wx.showToast({
          title: "内容不能超过5000字",
          icon: "none",
        });
        return;
      }

      // 通过事件传递富文本内容
      uni.$emit("contentEdited", {
        content: this.richContent,
      });
      wx.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style scoped>
/* 页面容器 */
.editor-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
}

/* 导航栏（微信原生风格） */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #f7f7f7;
  border-bottom: 1rpx solid #e5e5e5;
}

.header-left {
  display: flex;
  align-items: center;
  color: #000000;
}

.back-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 500;
}

.header-right {
  color: #07c160; /* 微信绿色按钮风格 */
  font-size: 30rpx;
  padding: 8rpx 16rpx;
}

/* 工具栏（微信editor推荐样式） */
.toolbar {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background-color: #f5f5f5;
  border-bottom: 1rpx solid #e5e5e5;
  flex-wrap: wrap;
}

.toolbar-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  margin-right: 12rpx;
  margin-bottom: 8rpx;
  font-size: 28rpx;
}

.toolbar-btn:active {
  background-color: #f0f0f0;
}

.toolbar-separator {
  width: 1rpx;
  height: 40rpx;
  background-color: #e5e5e5;
  margin: 0 8rpx;
}

/* 编辑区域 */
.editor-content {
  flex: 1;
  padding: 24rpx;
  font-size: 30rpx;
  line-height: 1.6;
  background-color: #ffffff;
}

/* 字数统计（底部栏） */
.word-count {
  padding: 16rpx 24rpx;
  font-size: 26rpx;
  color: #888888;
  background-color: #f5f5f5;
  border-top: 1rpx solid #e5e5e5;
  text-align: right;
}
</style>