<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home';
import CustomNavbar from './components/CustomNavbar.vue';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue';
import HotPannel from './components/HotPannel.vue';
import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/composables';
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

const hotlist = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI();
  hotlist.value = res.result
}
const isLoading = ref(false)
onLoad( async () => {
  isLoading.value = true
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData()
  ])
  isLoading.value =false
})

const {guessRef,onScrolltolower} = useGuessList()

const isTriggered = ref(false)
const onRefresherrefresh = async ()=>{
  isTriggered.value = true
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    guessRef.value?.getMore()
])
  isTriggered.value = false
}
</script>

<template>
  <CustomNavbar />
  <scroll-view refresher-enabled
  @refresherrefresh="onRefresherrefresh"
  :refresher-triggered="isTriggered"
  @scrolltolower="onScrolltolower"
  class="scroll-view"
  scroll-y
  >
    <PageSkeleton v-if="isLoading"/>
  <template v-else>
    <XtsSwiper :list="bannerList" />
    <CategoryPanel :list="categoryList" />
    <HotPannel :list="hotlist" />
    <XtsGuess ref="guessRef"/>
    <view class="index">index</view>
  </template>
  </scroll-view>
</template>

<style lang="scss">
/* #ifdef APP-PLUS */
#app,
/* #endif */
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;

}
// 这里需要复习
.scrool-vie{
  flex:1
}
</style>
