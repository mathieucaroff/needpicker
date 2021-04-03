import { concat } from '../util/concat'

export let createNeedSet = (rawList: string) => {
   let rawGroupList = rawList.split(/\n\n+/)

   let groupList = rawGroupList.map((rawGroup) => {
      return rawGroup.split('\n').map((rawNeed) => {
         return {
            name: rawNeed.replace(/\W/g, ''),
            verbose: rawNeed,
         }
      })
   })

   let needList = concat(...groupList)

   return {
      getGroupList: () => {
         return groupList
      },
      getNeedList: () => {
         return needList
      },
   }
}
