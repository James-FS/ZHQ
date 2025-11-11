<template>
  <view class="page">
    <view class="container">
      <text class="page-title">队伍详情</text>

      <form class="form" @submit.prevent="onSubmit">
        <view class="row">
          <common-input
            label="队伍名称"
            class="field"
            placeholder="请输入队伍名称"
            v-model="form.name"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="相关赛事"
            class="field"
            placeholder="请输入相关赛事"
            v-model="form.name"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            ref="contentInput"
            label="项目内容"
            class="field"
            placeholder="请输入项目内容"
            v-model="form.content"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="招募人数"
            class="field"
            placeholder="请输入招募人数"
            v-model="form.recruitNumber"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="所需技能"
            class="field"
            placeholder="示例:Python・机器学习・团队协作"
            v-model="form.skills"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="项目周期"
            class="field"
            placeholder="请输入项目周期"
            v-model="form.period"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="row">
          <common-input
            label="预期成果"
            class="field"
            placeholder="请输入预期成果"
            v-model="form.outcome"
            :required="true"
            :rules="usernameRules"
            @input="onUsernameInput"
          />
        </view>

        <view class="buttons">
          <common-button text="取消" type="secondary" @click="onCancel" />
          <common-button text="确定" type="primary" @click="onSubmit" />
        </view>
      </form>
    </view>
  </view>
</template>

<style scoped>
.page {
  background: linear-gradient(#eaf4ff, #f6f7fb);
  min-height: 100vh;
  box-sizing: border-box;
  font-family: -apple-system, "Helvetica Neue", "PingFang SC", "Microsoft YaHei",
    Arial;
}

/* 容器改为填充整个页面 */
.container {
  /* 取消最大宽度与自动居中，使盒子占满视窗 */
  max-width: none;
  width: 100%;
  height: 100vh; /* 填充整个可见窗口高度 */
  margin: 0;
  background: #fff;
  border-radius: 0; /* 若需圆角可改回 0 -> 6rpx */
  padding: 40rpx;
  box-shadow: none; /* 全页容器通常不需要外部阴影 */
  border: none;
  box-sizing: border-box;
  position: relative;
}

/* 标题向上对齐，保留视觉层次 */
.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #2a2a2a;
  margin: 12rpx 0 24rpx 12rpx;
}

/* 表单行样式保持，若希望贴边可调整内边距 */
.form {
  background: transparent;
}
.row {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 28rpx 12rpx;
  gap: 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.row:last-child {
  border-bottom: none;
}

.label {
  width: 220rpx;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  padding-left: 12rpx;
  box-sizing: border-box;
}

.field {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  padding: 0 24rpx;
  border: none;
  background: transparent;
  color: #666;
  font-size: 28rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
/* 底部操作条位置调整（仍固定）*/
.buttons {
  display: flex;
  gap: 24rpx;
  padding: 40rpx 80rpx;
  justify-content: space-between;
  border: box-sizing;
}

/* 避免底部内容被遮挡 */
.container::after {
  content: "";
  display: block;
  height: 220rpx; /* 增大以匹配 fixed 按钮高度与间距 */
}

/* 小屏适配 */
@media (max-width: 420rpx) {
  .label {
    width: 192rpx;
    font-size: 26rpx;
  }
  .page-title {
    font-size: 40rpx;
  }
  .btn {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 30rpx;
  }
}
</style>

<script>
import { CommonInput } from "@/components/Input.vue";
export default {
  components: {
    CommonInput,
  },
  data() {
    return {
      form: {
        name: "",
        eventIndex: 0,
        content: "",
        recruitNumber: "",
        skills: "",
        period: "",
        outcome: "",
      },
      events: ["weidai大赛", "weidai二赛"], // 赛事列表数据
    };
  },
  mounted() {
    // 页面加载时尝试恢复本地草稿
    this.loadDraft();
  },
  methods: {
    onEventChange(e) {
      this.form.eventIndex = e.detail.value;
    },
    // 通用输入回调：用于保存草稿
    onUsernameInput() {
      // v-model 已经更新 this.form，直接保存草稿
      this.saveDraft();
    },
    onCancel() {
      if (typeof uni !== "undefined" && uni.navigateBack) {
        uni.navigateBack();
      }
    },
    onSubmit() {
      // 提交逻辑
      // 基础校验示例
      if (!this.form.name) {
        uni.showToast({ title: "请填写队伍名称", icon: "none" });
        return;
      }
      console.log("提交表单：", this.form);
      uni.showToast({ title: "提交成功", icon: "success" });
      // 提交后默认不清空输入，保留用户输入；若需要清空，可调用 this.clearDraft()
    },
    // 将当前表单保存到本地缓存
    saveDraft() {
      try {
        if (typeof uni !== "undefined" && uni.setStorageSync) {
          uni.setStorageSync("createTeamDraft", this.form);
        } else if (typeof localStorage !== "undefined") {
          localStorage.setItem("createTeamDraft", JSON.stringify(this.form));
        }
      } catch (e) {
        console.warn("保存草稿失败", e);
      }
    },
    // 从本地缓存恢复表单
    loadDraft() {
      try {
        let d = null;
        if (typeof uni !== "undefined" && uni.getStorageSync) {
          d = uni.getStorageSync("createTeamDraft");
        } else if (typeof localStorage !== "undefined") {
          const raw = localStorage.getItem("createTeamDraft");
          d = raw ? JSON.parse(raw) : null;
        }
        if (d) {
          // 仅覆盖存在的字段，避免丢失默认结构
          this.form = Object.assign({}, this.form, d);
        }
      } catch (e) {
        console.warn("加载草稿失败", e);
      }
    },
    // 清除本地草稿（可在需要时调用）
    clearDraft() {
      try {
        if (typeof uni !== "undefined" && uni.removeStorageSync) {
          uni.removeStorageSync("createTeamDraft");
        } else if (typeof localStorage !== "undefined") {
          localStorage.removeItem("createTeamDraft");
        }
      } catch (e) {
        console.warn("清除草稿失败", e);
      }
    },
  },
};
</script>