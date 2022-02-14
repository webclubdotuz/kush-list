import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { aksTypes } from '../Aksesuar'

export const Dovogor = ({
  aksesSum,
  objPriceDver,
  infoTabe,
  infoZakaz,
  info,
  aksesData,
  extra,
}) => {
  const tegs = [
    'Сумма',
    'Келисим.',
    'Сумма с НДС',
    'СКИДКА_%.',
    'СКИДКА СУММА',
    'СУММА СО СКИДКОЙ',
  ]
  const { register, handleSubmit, watch, formState, setValue, getValues } =
    useForm({ mode: 'onChange' })

  useEffect(() => {
    let ndsSum =
      Object.values(objPriceDver).reduce((a, b) => +a + +b) -
      getValues('Келисим.') +
      aksesSum
    setValue('Сумма', ndsSum.toLocaleString())

    setValue('Сумма с НДС', (+(+ndsSum / 0.85).toFixed()).toLocaleString())
    setValue(
      'СКИДКА СУММА',
      ((ndsSum * getValues('СКИДКА_%.')) / 100).toLocaleString()
    )

    setValue(
      'СУММА СО СКИДКОЙ',
      (
        ndsSum - +getValues('СКИДКА СУММА').replace(/[\s.,%]/g, '')
      ).toLocaleString()
    )
  }, [
    aksesSum,
    objPriceDver,
    watch('Келисим.'),

    watch('СКИДКА_%.'),
    watch('СКИДКА СУММА'),
  ])

  const [onDist, setOnDist] = useState({
    'Келисим.': false,
    'СКИДКА_%.': false,
  })
  const setOnDis = (tegSet, event) => {
    let tkeNot = tegSet == 'Келисим.' ? 'СКИДКА_%.' : 'Келисим.'
    setOnDist((prev) => ({ ...prev, [tkeNot]: true }))
    if (event.length == 0) {
      setOnDist({ 'Келисим.': false, 'СКИДКА_%.': false })
    }
  }

  useEffect(() => {
    setOnDis('Келисим.', getValues('Келисим.'))
  }, [getValues('Келисим.')])
  useEffect(() => {
    setOnDis('СКИДКА_%.', getValues('СКИДКА_%.'))
  }, [getValues('СКИДКА_%.')])
  const [loader,setLoader] =useState(false)

  const onSubmit = (data) => {

    let tabelInfo = []
    infoTabe.count.forEach((i) => {
      tabelInfo.push({})
      for (let key in infoTabe.data.arrTabel) {
        if (+key.split('_').at(-1) == i) {
          tabelInfo.at(-1)[key.split('_')[0]] = infoTabe.data.arrTabel[key]
        }
      }
    })
    

    let dataSet = {aksesSum}
    aksTypes.forEach((teg) => {
      dataSet[teg] = {
        шт: +aksesData[teg],
        цена: +aksesData[teg + '_price'],
        сумма: +aksesData[teg + '_summa'],
      }
    })
   
    // document.location.replace('http://www.site.ru')
    
    const infoTotal =({
      ДП: data,
      Косим: extra,
      Таблица: {
        tabelInfo,
        НалНум: infoTabe.data.НалНум,
        КаронаНум: infoTabe.data.КаронаНум,
      },
      клиентИнфо: infoZakaz,
      ДВЕРИ: {
        Двери: {
          mData: info.m2Data.dverm2,

          Цена: info.info.Двери.цена,
          summa: info.objPrice.Двери,
        },
        Карона: {
          mData: info.m2Data.karonaM,
          Цена: info.info.Карона.цена,
          summa: info.objPrice.Карона,
        },
        Наличник: {
          mData: info.m2Data.nalichnikv2,
          Цена: info.info.Наличник.цена,
          summa: info.objPrice.Наличник,
        },
        Добор: {
          mData: info.m2Data.doborKvmetr,
          Цена: info.info.Добор.цена,
          summa: info.objPrice.Добор,
        },

        Кубик: {
          mData: info.m2Data.KubikSht,
          Цена: info.info.Кубик.цена,
          summa: info.objPrice.Кубик,
        },

        Ночка: {
          mData: info.m2Data.NochkaSht,
          Цена: info.info.Ночка.цена,
          summa: info.objPrice.Ночка,
        },
        Общий_итого: info.totol || 0,
      },
      АКСЕССУАРЫ: dataSet,
    })
    const senData = async ()=>{ 
      setLoader(true)
      try {
      const res =  await fetch(window.storeOrderItem, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...infoTotal,orderId:window.orderId,orderGenId:window.orderGenId} )
      })
      const data = await res.json()
      console.log(data)
      window.location.replace(window.redirectToOrder)
      } catch (error) {
        console.log(error)
        setLoader(false)
      }
    }
    senData()
  }
  
  // console.log(window.orderId)
  const [radioNds, setRadioNds] = useState(false)

  return (
    <>
      <br />
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="table table-bordered ">
          <thead>
            <tr>
              {tegs.map((teg, index) => (
                <th key={index}>
                  <h6>
                    <b>
                
                      {teg == 'Сумма с НДС' ? (
                        <>
                          {teg}{' '}
                          <input
                            type="checkbox"
                            onClick={() => setRadioNds(!radioNds)}
                          />
                        </>
                      ) : (
                        teg
                      )}
                    </b>
                  </h6>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tegs.map((teg, index) => (
                <th key={index}>
                  <h6>
                    {teg.split('').at(-1) == '.' ? (
                      <input
                        {...register(teg)}
                        type="number"
                        step="any"
                        className={`number-price ${
                          teg.split('').at(-1) !== '.' && 'input-border'
                        }`}
                        disabled={
                          teg.split('').at(-1) !== '.' ? true : onDist[teg]
                        }
                      />
                    ) : teg == 'СУММА СО СКИДКОЙ' ? (
                      <b>
                        <h3>{getValues(teg)}</h3>
                      </b>
                    ) : teg == 'Сумма с НДС' ? (
                      radioNds && getValues(teg)
                    ) : (
                      getValues(teg)
                    )}
                  </h6>
                </th>
              ))}
            </tr>
          </tbody>
        </table>
        <button disabled={loader} type="submit" className="btn btn-success">
          {!loader?'Cохранить':<div class="spinner-border text-light" role="status"><span class="sr-only"></span></div>}
        </button>
      </form>
    </>
  )
}
