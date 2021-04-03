export interface Subscription {
   remove: () => void
}

export interface Atom<T> {
   subscribe: (listener: (value: T) => void) => Subscription
   get: () => T
   set: (newValue: T) => void
}

/**
 *
 * @param initalValue The initial value of the atom
 * @returns An atom encapsulating the given value
 */
export let atom = <U, T extends U = U>(initalValue: T): Atom<T> => {
   // <U, T extends U = U> is a trick to loosen Typescript's type inference
   type Listener = (value: T) => void

   let value = initalValue
   let listenerList: Listener[] = []

   return {
      subscribe: (listener: Listener) => {
         listenerList.push(listener)

         let removeFunction = () => {
            let k = listenerList.indexOf(listener)
            listenerList.splice(k, 1)
         }

         return {
            remove: () => {
               removeFunction()
               removeFunction = () => {}
            },
         }
      },
      get: () => value,
      set: (newValue: T) => {
         value = newValue
         listenerList.forEach((listener) => {
            listener(value)
         })
      },
   }
}
