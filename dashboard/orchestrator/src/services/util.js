export const retry = (fn, many, wait) => {
  let count = 0;
  const exec = () => fn()
    .catch(err => {
      if(++count >= many){
        return Promise.reject(err)
      }else
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          exec().then(resolve,reject)
        }, wait)
      })
    })
  return exec()
}
