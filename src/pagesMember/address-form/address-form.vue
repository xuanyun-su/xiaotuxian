<script setup lang="ts">
import { ref } from 'vue'
import { postMemberAddressAPI, getMemberAddressAPIByIdAPI, postMemberAddressAPIByIdAPI } from "@/services/address";
import { onLoad } from '@dcloudio/uni-app';
// 表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})
const query = defineProps<{
  id?: string
}>()

uni.setNavigationBarTitle({ title: query.id ? "修改地址" : "新建地址" })

// #ifdef MP-WEIXIN
const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  form.value.fullLocation = ev.detail.value.join(' ')
  const [provinceCode, cityCode, countyCode] = ev.detail.code!
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// #endif
// #ifdef H5 || APP-PLUS
const onchange:UniHelper.UniDataPickerOncahnge= (ev)=>{
  const [provinceCode, cityCode, countyCode] = ev.detail.value.map((v)=>v.value)
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// #endif

const getMemberAddressByIdData = async () => {
  console.log(query.id)
  if (query.id) {
    const res = await getMemberAddressAPIByIdAPI(query.id)
    Object.assign(form.value, res.result)
  }
}

const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}

const onSubmit = async () => {
  try {
    await formRef.value?.validate?.()
    if (!query.id) {

      await postMemberAddressAPI(form.value)
    } else {
      await postMemberAddressAPIByIdAPI(query.id, form.value)
    }
    setTimeout(() => {
      uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' })
    }, 500)
    uni.navigateBack()
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请将信息填写完整' })
  }
}

onLoad(() => {
  getMemberAddressByIdData()
})

// 表单校验规则
const rules:UniHelper.UniFormsRules = {
  receiver: {
    rules: [
      { required: true, errorMessage: '请输入收货人姓名' }
    ]
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      {pattern:/^1[3-9]\d{9}$/,errorMessage:'请输入正确手机号码'}
    ]
  },
  countyCode: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请选择详细地址' }],
  },
}
const formRef = ref<UniHelper.UniFormsInstance>()

</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiver" />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item" >
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.contact" />
      </uni-forms-item>
      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">所在地区</text>
        <!--#ifdef MP-WEIXIN -->
        <picker class="picker" mode="region" :value="form.fullLocation.split(' ')" @change="onRegionChange">
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
        <!-- #endif -->
        <!--#ifdef H5 || APP-PLUS -->
        <uni-data-picker
          placeholder="请选择地址"
          popup-title="请选择城市"
          collection="opendb-city-china"
          field="code as value,name as text"
          orderby="value asc"
          :step-search="true"
          self-field="code"
          parent-field="parent_code"
          @change="onchange"
          @nodeclick="onnodeclick"
          :clear-icon="false"
          v-mode="form.countyCode"
        >

        </uni-data-picker>
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch @change="onSwitchChange" class="switch" color="#27ba9b" :checked="form.isDefault === 1" />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<style lang="scss">
/* #ifdef H5||APP-PLUS */
:deep(.selected-area){
  height: auto;
  flex:0 1 auto
}
/* #endif  */
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
