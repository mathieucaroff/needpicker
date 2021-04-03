import { inflate } from 'zlib'
import { h } from './lib/hyper'
import { aurSet } from './need/aur'
import { initPage } from './page/init'
import { atom, Atom } from './statelib'
import { concat } from './util/concat'

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
   }

   /* Store */
   interface Topic {
      needMap: Record<string, boolean>
   }
   interface Store {
      state: State
      hook: Topic
      reducerList: Reducer[]
      dispatch: (action: Action) => void
      register: (reducer: Reducer) => void
   }

   let store: Store = {
      state: {
         needMap: Object.fromEntries(aurSet.getNeedList().map(({ name }) => [name, atom(false)])),
      },
      reducerList: [],
      dispatch: (action) => {
         store.reducerList.forEach((reducer) => {
            store.state = reducer(action, store.state)
         })
      },
      register: (reducer) => {
         store.reducerList.push(reducer)
      },
   }

   /* Reducer */
   interface Reducer {
      (action: Action, state: State): State
   }

   // needReducer
   store.register((action, state) => {
      if (action.kind === 'toggleNeed') {
         return { ...state, activeNeedList }
      }

      return state
   })

   /* Event handler */
   let handleButtonClick = (needName) => {
      store.dispatch({ kind: 'toggleNeed', needName })
   }

   /* Propagation */
   let needButtonGroupDiv = h(
      'div',
      {},
      aurSet.getGroupList().map((group) =>
         h(
            'div',
            {
               className: 'my-3',
            },
            group.map((need) =>
               h(
                  'div',
                  {
                     className: 'my-1',
                  },
                  [
                     h('button', {
                        type: 'button',
                        className: 'btn btn-pill btn-secondary',
                        textContent: need.verbose,
                        onclick: handleButtonClick(need.name),
                     }),
                  ],
               ),
            ),
         ),
      ),
   )

   maindiv.appendChild(needButtonGroupDiv)
}
