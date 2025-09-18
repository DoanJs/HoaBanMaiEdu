export {}
// // --------------
// const [dataTargets, setDataTargets] = useState([]);
// useEffect(() => {
//   getDocsData({
//     nameCollect: 'targets',
//     setData: setDataTargets
//   })
// }, [])

// const getTargets = async () => {
//   console.log(dataTargets)
//   // console.log(targetsNNDD)
// }


// const handleCreateData = async () => {
//   const dataNNDD = targetsNNDD.map((_) => {
//     return {
//       ..._,
//       fieldId: '3EUhuJoxzHauQpx1pPxq',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataCA = targetsCA.map((_) => {
//     return {
//       ..._,
//       fieldId: 'zfnX1X3wvP46rRF3k4gB',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataCNXH = targetsCNXH.map((_) => {
//     return {
//       ..._,
//       fieldId: 'qw6gesBxUmEgEDow153O',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataHV = targetsHV.map((_) => {
//     return {
//       ..._,
//       fieldId: '48UQhGWIQECsi8lAd7Sc',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataNNH = targetsNNH.map((_) => {
//     return {
//       ..._,
//       fieldId: 'gGNJ5mQZRSxkSW4qAu6F',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataNT = targetsNT.map((_) => {
//     return {
//       ..._,
//       fieldId: 'j6fFXTUD1D6rym4UmKkV',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataTTCY = targetsTTCY.map((_) => {
//     return {
//       ..._,
//       fieldId: 'Nji6cMUy0TcZ1Tw8B2iG',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
//   const dataVDT = targetsVDT.map((_) => {
//     return {
//       ..._,
//       fieldId: 'cyg1PnZ4snHm583dFBzp',
//       createAt: serverTimestamp(),
//       updateAt: serverTimestamp(),
//     }
//   })
  
//   const datas = [
//     ...dataCA,
//     ...dataCNXH,
//     ...dataHV,
//     ...dataNNDD,
//     ...dataNNH,
//     ...dataNT,
//     ...dataTTCY,
//     ...dataVDT
//   ]
//   // const promiseItems = datas.map((_) => addDocData({
//   //   nameCollect: 'targets',
//   //   value: _,
//   //   metaDoc: 'targets'
//   // }))

//   // await Promise.all(promiseItems)
//   console.log('Completed')
// }

// // ---------------

// <button onClick={handleCreateData}>Upload</button>
//           <SpaceComponent height={50} />
//           <button onClick={getTargets}>Get Targets</button>