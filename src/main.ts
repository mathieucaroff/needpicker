import { h } from './lib/hyper'
import { aurSet } from './need/aur'
import { Need } from './need/needSet'
import { initPage } from './page/init'

export let main = async () => {
   let { maindiv } = initPage({ document, window })

   /* Action */
   interface ToggleNeed {
      kind: 'toggleNeed'
      needName: string
   }

   type Action = ToggleNeed

   /* State */
   interface State {
      needMap: Record<string, boolean>
      search: string
   }

   interface Computed {
      searchRegex: RegExp
   }

   let state: State = {
      needMap: Object.fromEntries(aurSet.getNeedList().map(({ name }) => [name, false])),
      search: '',
   }

   let computed: Computed = {
      searchRegex: /.*/,
   }

   let getButtonDisplayState = (needName: string) => {
      return state.needMap[needName] || needName.match(computed.searchRegex)
   }

   let getButtonClass = (needName: string) => {
      let addDNone = getButtonDisplayState(needName) ? '' : ' d-none'
      return `btn btn-pill btn-${state.needMap[needName] ? 'primary' : 'secondary'}${addDNone} mx-1`
   }

   let getCardBlockClass = (group: Need[]) => {
      let addDNone = group.some(({ name }) => getButtonDisplayState(name)) ? '' : ' d-none'
      return `card-block${addDNone}`
   }

   let refreshButtonClass = (needName: string) => {
      needButtonMap[needName].className = getButtonClass(needName)
   }

   let refreshCardBlockClass = (groupIndex: number) => {
      let group = aurSet.getGroupList()[groupIndex]
      groupCardBlockArray[groupIndex].className = getCardBlockClass(group)
   }

   let refreshActiveNeedRecap = () => {
      ;[...activeNeedDisplay.children].forEach((child) => {
         activeNeedDisplay.removeChild(child)
      })

      Object.entries(state.needMap).forEach(([needName, active]) => {
         if (active) {
            activeNeedDisplay.appendChild(htmlButton(needName))
         }
      })
   }

   let handleSearchChange = () => {
      state.search = needSearchBox.value
      let normalized = state.search.toLowerCase().replace(/\W/, '')
      let regexString = normalized.split('').join('.*')
      computed.searchRegex = new RegExp(regexString)

      Object.keys(needButtonMap).forEach((needName) => {
         refreshButtonClass(needName)
      })
      groupCardBlockArray.forEach((_, groupIndex) => {
         refreshCardBlockClass(groupIndex)
      })
   }

   let handleButtonClick = (needName: string) => () => {
      state.needMap[needName] = !state.needMap[needName]
      refreshButtonClass(needName)
      refreshActiveNeedRecap()
   }

   let htmlButton = (needName: string) => {
      let need = aurSet.getNeed(needName)

      return h('button', {
         type: 'button',
         className: getButtonClass(need.name),
         textContent: need.verbose,
         onclick: handleButtonClick(need.name),
      })
   }

   /* Page component access shortcut */
   let needButtonMap: Record<string, HTMLButtonElement> = {}
   let groupCardBlockArray: HTMLDivElement[] = []

   /* Page content */
   let needSearchBox = h('input', {
      className: 'my-4 form-control',
      placeholder: 'Search for your needs...',
      onchange: handleSearchChange,
      onkeydown: handleSearchChange,
      onkeyup: handleSearchChange,
   })

   let activeNeedDisplay = h('div', { className: 'my-3' })

   let needButtonGroupDiv = h(
      'div',
      { className: 'card-columns' },
      aurSet.getGroupList().map((group, groupIndex) =>
         h('div', { className: 'card' }, [
            (groupCardBlockArray[groupIndex] = h(
               'div',
               { className: getCardBlockClass(group) },
               group.map((need) =>
                  h('div', { className: 'my-1' }, [
                     (needButtonMap[need.name] = htmlButton(need.name)),
                  ]),
               ),
            )),
         ]),
      ),
   )

   maindiv.appendChild(needSearchBox)
   maindiv.appendChild(activeNeedDisplay)
   maindiv.appendChild(needButtonGroupDiv)
}
