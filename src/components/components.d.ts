// src/types/components.d.ts
import type XtsGuess from './XtsGuess.vue'
import  XtsSwiper from './XtsSwiper.vue'
declare module 'vue' {
  export interface GlobalComponents {
    XtsSwiper: typeof XtsSwiper
    XtsGuess: typeof XtsGuess
  }
}