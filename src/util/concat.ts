export let concat = <T>(...arrayArray: T[][]) => {
   return ([] as T[]).concat(...arrayArray)
}
