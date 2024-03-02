import type { AddressItem, AddressParams } from "@/types/address"
import { http } from "@/utils/http"

export const postMemberAddressAPI = (data:AddressParams)=>{
    return http({
        method:'POST',
        url:'/member/address',
        data
    })
}

export const getMemberAddressAPI = ()=>{
    return http<AddressItem[]>({
        method:'GET',
        url:'/member/address'
    })
}

export const getMemberAddressAPIByIdAPI = (id:string)=>{
    return http<AddressItem[]>({
        method:'GET',
        url:`/member/address/${id}`
    })
}

export const postMemberAddressAPIByIdAPI = (id:string,data:AddressParams)=>{
    return http<AddressItem[]>({
        method:'PUT',
        url:`/member/address/${id}`,
        data
    })
}


export const deleteMemberAddressByIdAPI = (id: string) => {
    return http({
      method: 'DELETE',
      url: `/member/address/${id}`,
    })
  }