import { repository } from '../../package.json'
import { githubCornerHTML } from '../lib/githubCorner'
import { h } from '../lib/hyper'

interface InitProp {
   document: Document
   window: Window
}

export let initPage = (prop: InitProp) => {
   let { document } = prop

   let maindiv = h('div')

   let corner = h('i', { innerHTML: githubCornerHTML(repository) })

   document.body.append(
      h('h1', {
         textContent: document.title,
         className: 'inline',
      }),
      maindiv,
      corner,
   )

   return { maindiv }
}
