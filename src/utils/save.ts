
const fs = require('fs')
const path = require('path')

function writeConalFile(filePath, data){
  if (!fs.existsSync(filePath)) {
    mkdir(filePath)
  }

  fs.appendFile(filePath, data, (error) => {
    if(error) {
      console.log(error)
      return false
    }
  })
}

function mkdir(filePath) {
  let dirCache={}, arr
  if(/\\/.test(filePath)){
    //windows
    arr = filePath.split('\\')
  }else{
    //linux
    arr = filePath.split('/')
  }
  arr.shift()
  let dir = '/' + arr[0]
  for(let i = 1; i < arr.length; i++){
    if(!dirCache[dir] && !fs.existsSync(dir)){
      dirCache[dir]=true
      fs.mkdirSync(dir)
    }
    dir = dir + '/' + arr[i]
  }
  fs.writeFileSync(filePath, '')
}

// function deleteLogFile(name, nowDate, day) {
//   let dps = []
//   let oneday = 24 * 3600 * 1000
//   for(let i = 0; i < 7; i++){
//     // one week
//     let delDate = getTime('date', new Date(nowDate).getTime() - day * oneday - i * oneday)
//     let delName = name + '__' + 'err' + '.' + delDate
//     let delPath = path.join(__dirname, '../../../logs/' + delName + '.log')
//     dps.push(delPath)
//   }
//   for(let j = 0; j < dps.length; j++){
//     if(fs.existsSync(dps[j])) {
//       fs.unlink(dps[j], function(error){
//         if(error){
//           console.log('save-error: ', error)
//         }
//       })
//     }
//   }
// }

export default function saveError(name: string, content: string, nowTime){
  let nowDate = nowTime.split(' ')[0]
  let saveName = name + '.' + nowDate
  let savePath = path.join(__dirname, '../../../../logs/' + saveName + '.log')

  writeConalFile(savePath, content + '\n')
}