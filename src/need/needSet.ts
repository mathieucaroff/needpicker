import { concat } from '../util/concat'

export interface Need {
   name: string
   verbose: string
}

export let createNeedSet = (rawList: string) => {
   let needMap = {}

   let rawGroupList = rawList.split(/\n\n+/)

   let groupList = rawGroupList.map((rawGroup) => {
      return rawGroup.split('\n').map((rawNeed) => {
         let name = rawNeed.toLowerCase().replace(/\W/g, '')

         return (needMap[name] = {
            name,
            verbose: rawNeed,
         })
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
      getNeed: (needName: string): Need => {
         return needMap[needName]
      },
   }
}
