<template>
  <view class="editor-page">
    <!-- 顶部导航栏 -->
    <view class="editor-header">
      <view class="header-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="header-title">编辑项目内容</text>
      </view>
      <view class="header-right">
        <view class="save-btn" @click="saveContent">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 编辑区域 -->
    <view class="editor-container">
      <!-- 工具栏 -->
      <view class="toolbar">
        <view class="toolbar-btn" @click="insertBold">
          <text class="btn-text">B</text>
        </view>
        <view class="toolbar-btn" @click="insertItalic">
          <text class="btn-text">I</text>
        </view>
        <view class="toolbar-btn" @click="insertUnderline">
          <text class="btn-text">U</text>
        </view>
        <view class="toolbar-divider"></view>
        <view class="toolbar-btn" @click="insertLink">
          <text class="btn-text">🔗</text>
        </view>
        <view class="toolbar-btn" @click="insertImage">
          <text class="btn-text">🖼</text>
        </view>
      </view>

      <!-- 文本编辑区 -->
      <textarea
        v-model="content"
        class="editor-textarea"
        placeholder="请输入项目内容，支持多行文本..."
        :auto-height="false"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- 字数统计 -->
      <view class="word-count">
        <text>{{ content.length }} / 5000 字</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      isFocused: false,
    };
  },
  onLoad(options) {
    // 从查询参数获取内容
    if (options.content) {
      this.content = decodeURIComponent(options.content);
    }
  },
  methods: {
    goBack() {
      // 返回上一页，传递编辑后的内容
      uni.$emit("contentEdited", {
        content: this.content,
      });
      uni.navigateBack({
        delta: 1,
      });
    },
    saveContent() {
      // 保存内容
      if (this.content.length > 5000) {
        uni.showToast({
          title: "内容不能超过5000字",
          icon: "none",
        });
        return;
      }

      // 通过事件传递数据
      uni.$emit("contentEdited", {
        content: this.content,
      });

      uni.navigateBack({
        delta: 1,
      });
    },
    insertBold() {
      this.insertText("**加粗文本**");
    },
    insertItalic() {
      this.insertText("*斜体文本*");
    },
    insertUnderline() {
      this.insertText("__下划线__");
    },
    insertLink() {
      uni.showModal({
        title: "插入链接",
        content: "请输入链接地址",
        editable: true,
        placeholderText: "https://",
        success: (res) => {
          if (res.confirm && res.content) {
            this.insertText(`[链接](${res.content})`);
          }
        },
      });
    },
    insertImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // 这里应该上传图片，暂时用占位符
          this.insertText(`![图片](${res.tempFilePaths[0]})`);
        },
      });
    },
    insertText(text) {
      this.content += text;
    },
    onFocus() {
      this.isFocused = true;
    },
    onBlur() {
      this.isFocused = false;
    },
  },
};
</script>

<style scoped lang="scss">
.editor-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #e0e0e0;
  min-height: 80rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  cursor: pointer;
  border-radius: 4rpx;
  transition: background 0.2s;
}

.back-btn:active {
  background: #f0f0f0;
}

.back-icon {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  gap: 12rpx;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 20rpx;
  background: #0066cc;
  color: #fff;
  border-radius: 4rpx;
  cursor: pointer;
  min-height: 40rpx;
}

.save-btn:active {
  background: #004da6;
}

.save-text {
  font-size: 28rpx;
  font-weight: 500;
}

.editor-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.toolbar {
  display: flex;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #f9f9f9;
  border-bottom: 1rpx solid #e0e0e0;
  align-items: center;
  overflow-x: auto;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 4rpx;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toolbar-btn:active {
  background: #f0f0f0;
  border-color: #0066cc;
}

.btn-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #333;
}

.toolbar-divider {
  width: 1rpx;
  height: 32rpx;
  background: #e0e0e0;
  margin: 0 4rpx;
  flex-shrink: 0;
}

.editor-textarea {
  flex: 1;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
  border: none;
  outline: none;
  resize: none;
  box-sizing: border-box;
  color: #333;
}

.word-count {
  padding: 12rpx 20rpx;
  text-align: right;
  font-size: 24rpx;
  color: #999;
  background: #f9f9f9;
  border-top: 1rpx solid #e0e0e0;
}
</style>
