import type { XtsGuessInstance } from "@/types/component"
import { ref } from "vue"

export const useGuessList = () => {
    const guessRef = ref<XtsGuessInstance>()
    const onScrolltolower = () => {
        guessRef.value?.getMore()

    }
    return {
        guessRef,
        onScrolltolower
    }
}