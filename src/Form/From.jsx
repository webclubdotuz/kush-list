import { React, useEffect, useMemo, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { dataType } from '../data/data'
import './Form.css'
import { List } from './List/List'
// import ReactToPrint, { useReactToPrint } from 'react-to-print'
const typesVlt = [
  'Модель',
  'Цвет',
  'Глухой стекло',
  'Бойы',
  'Ени',
  'шт',
  'м2',
  'Нал№',
  'НалБойы',
  'НалЕни',
  'НалШт',
  'Кор№',
  'КорК-Метр',
  'КорК-шт',
  'Коробка',

  'Добор-Бойы',
  'Добор-Ени',
  'Добор-шт',
  'Кубик',
  'Ночка',
  'Паска',
]
export let infosTabel = []

// let m2 = 0
const Form = ({
  setM2,
  info,
  setInfo,
  getMusars,
  nalich,
  setNalich,
  selecData,
  setobjPrice,
  setNalichPrice,
  setm2Data,
  getTabelInfo,
  zakazRef,
}) => {
  const dataType2 = dataType
  const [tabelData, setTabelData] = useState({})
  const { register, handleSubmit, watch, formState, setValue, getValues } =
    useForm({ mode: 'onChange' })

  const [count, setCount] = useState([1])

  const getValIndex = (name) => count.map((index) => name + index)
  const totoalReduxe = (nameTeg) => {
    return nameTeg.reduce(
      (previousValue, currentValue) => +previousValue + +currentValue
    )
  }
  const WatchAdd = (teg) => {
    teg.forEach((e) => watch(getValIndex(e + '_')))
  }

  useEffect(() => {
    for (let i = 0; i < count.length; i++) {
      setValue(
        'м2_' + count[i],
        +watch('Бойы_' + count[i]) *
          +watch('Ени_' + count[i]) *
          +watch('шт_' + count[i])
      )
      // =(дверь.ширина + (Ширина.Наличник*2-0,06))*Корона.Штук

      setValue(
        'КорК-Метр_' + count[i],
        (+watch('Ени_' + count[i]) +
          (+watch('НалЕни_' + count[i]) * 2 - 0.06)) *
          +watch('КорК-шт_' + count[i])
      )
      WatchAdd([
        'шт',
        'Бойы',
       'Ени',
       'шт',
        'НалЕни',
        'НалШт',
        'КорК-шт',
        'НалБойы',
        'Кубик',
        'Ночка',
        'Добор-Ени',
        'Добор-Бойы',
        'Добор-шт',
        'Паска',
        'Модель',
        'Цвет',
        'Глухой стекло',
      'Коробка'
      ])
    }
    
    const sht = getValues(getValIndex('шт_'))
    let m2Set = +totoalReduxe(getValues(getValIndex('м2_')))
    setM2(m2Set)
  })

  let m2Set = totoalReduxe(getValues(getValIndex('м2_')))

  useEffect(() => {
    setm2Data((prev) => ({ ...prev, dverm2: +m2Set }))
  }, [m2Set])
  // const nalishTotoalEni = +totoalReduxe(getValues(getValIndex('НалЕни_'))) || 0

  const nalishTotoalSht = +totoalReduxe(getValues(getValIndex('НалШт_'))) || 0
  const nalishTotoalBoy = +totoalReduxe(getValues(getValIndex('НалБойы_'))) || 0

  const kubikMetrSumm = +totoalReduxe(getValues(getValIndex('Кубик_'))) || 0
  const NochkaMetrSumm = +totoalReduxe(getValues(getValIndex('Ночка_'))) || 0
  const KaronTotolSht = +totoalReduxe(getValues(getValIndex('КорК-шт_'))) || 0
  const KaraMetr = +totoalReduxe(getValues(getValIndex('КорК-Метр_'))) || 0
  const DoborShtM = +totoalReduxe(getValues(getValIndex('Добор-шт_'))) || 0
  const doborBoyn = +totoalReduxe(getValues(getValIndex('Добор-Бойы_'))) || 0
  const doborEni = +totoalReduxe(getValues(getValIndex('Добор-Ени_'))) || 0

  const totoalStr = (nameTeg)=>{
    return nameTeg.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    )
  }

  // const paskaSet =totoalStr(getValues(getValIndex('Паска_'))) || 0
  // const korobksSet = totoalStr(getValues(getValIndex('Коробка_'))) || 0
  // const modelSet = totoalStr(getValues(getValIndex('Модель_'))) || 0
  // const svetSet = totoalStr(getValues(getValIndex('Цвет_'))) || 0
  // const gluxoySet = totoalStr(getValues(getValIndex('Глухой стекло_'))) || 0
  // const boyi = tot
  const data =  typesVlt.map(teg=>{
    return totoalStr(getValues(getValIndex(teg+'_'))) 
  })
  // console.log(data)
  useEffect(()=>{
    console.log('hhh')
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  },data)
  useEffect(() => {
    const nalichBoyn = getValues(getValIndex('НалБойы_'))
    const nalichSht = getValues(getValIndex('НалШт_'))

    let summ = 0
    for (let i = 0; i < count.length; i++) {
      summ += +nalichBoyn[i] * +nalichSht[i]
    }
    setm2Data((prev) => ({ ...prev, nalichnikv2: +summ }))
    setobjPrice((prev) => ({
      ...prev,
      Наличник: +info.parameters.Наличник.цена * summ,
    }))
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [
    // nalishTotoalEni,
    nalishTotoalSht,
    nalishTotoalBoy,
    KaronTotolSht,
    // KaraMetr,
    info.parameters.Наличник.цена,
  ])
  //----
 

  useEffect(() => {
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
      count,
    }))
  }, [count])
  useEffect(() => {
    const urioTrue = dataType2[selecData.type][info.type]
      ? info.type
      : selecData.type == 'Универсальный'
      ? 'нет'
      : 'Узор'

    const price = dataType2[selecData.type][urioTrue].Наличник.цена

    setNalichPrice(+price * +getValues('НалЕни_1'))
    // setNalichPrice(2)
    setInfo((prev) => ({
      type: urioTrue,
      parameters: {
        ...prev.parameters,

        Наличник: {
          ...prev.parameters.Наличник,
          цена: +price * +getValues('НалЕни_1'),
        },
      },
    }))

    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [watch('НалЕни_1'), info.type])
  useEffect(() => {
    setValue('НалЕни_1', 1)
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [selecData])
  useEffect(() => {
    setobjPrice((prev) => ({
      ...prev,
      Карона: +KaraMetr * +info.parameters.Карона.цена,
    }))
    setm2Data((prev) => ({ ...prev, karonaM: +KaraMetr }))
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [KaraMetr, info.parameters.Карона.цена])

  useEffect(() => {
    let summ = 0
    const doborBoyn = getValues(getValIndex('Добор-Бойы_'))
    const doborEni = getValues(getValIndex('Добор-Ени_'))
    const doborSht = getValues(getValIndex('Добор-шт_'))

    for (let con = 0; con < count.length; con++) {
      summ += +doborBoyn[con] * +doborEni[con] * +doborSht[con]
    }
    setm2Data((prev) => ({ ...prev, doborKvmetr: +summ }))
    setobjPrice((prev) => ({
      ...prev,
      Добор: summ.toFixed(2) * +info.parameters.Добор.цена,
    }))

    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [info.parameters.Добор.цена, DoborShtM, doborBoyn, doborEni])

  useEffect(() => {
    setobjPrice((prev) => ({
      ...prev,
      Кубик: kubikMetrSumm * +info.parameters.Кубик.цена,
      Ночка: NochkaMetrSumm * +info.parameters.Ночка.цена,
    }))
    setm2Data((prev) => ({
      ...prev,
      KubikSht: +kubikMetrSumm,
      NochkaSht: +NochkaMetrSumm,
    }))
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [
    kubikMetrSumm,
    NochkaMetrSumm,
    info.parameters.Кубик.цена,
    info.parameters.Ночка.цена,
  ])
  const delTabel = (indexId) => {
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
    if (indexId !== 1)
      setCount((prev) => prev.filter((index) => index != indexId))
  }
  useEffect(() => {
    getTabelInfo((prev) => ({
      ...prev,
      data: {
        arrTabel: getValues(),
        НалНум: getValues('НаличникНум'),
        КаронаНум: getValues('КоронаНум'),
      },
    }))
  }, [watch('НаличникНум'), watch('КоронаНум')])
  let isInclude = [
    'НалБойы',
    'НалЕни',
    'НалШт',
    'КорК-Метр',
    'КорК-шт',
    'Добор-Ени',
    'Добор-шт',
  ]
  const tabelRef = useRef()

  // const sshandleZakaz = useReactToPrint({
  //   content: () => zakazRef.current,
  // })

  return (
    <>
      <div className="tabel-start mt-5 ">
        <form ref={zakazRef}>
          <table className="table-bordered tabel-my">
            <thead>
              <tr>
                {typesVlt
                  .filter((teg) => !isInclude.includes(teg))
                  .map((keys, index) => (
                    <>
                      <th
                        scope="col"
                        colSpan={
                          keys == 'Нал№'
                            ? 3
                            : keys == 'Кор№'
                            ? 2
                            : keys == 'Добор-Бойы'
                            ? 3
                            : 1
                        }
                        key={index}
                        style={{ textAlign: 'center' }}
                      >
                        <font size="2">
                          {keys == 'Нал№' ? (
                            <>
                              <table>
                                <tr>
                                  <td className="td-top" colSpan={4}>
                                    <div className="row">
                                      <div className="col-7"> Наличник№</div>
                                      <div className="col-5">
                                        <input
                                          type="text"
                                          className="input-num "
                                          {...register('НаличникНум')}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="tr-top">
                                  <td className={'boy td-entr'}>Бойы</td>
                                  <td className={'td-entr'}>Ени</td>
                                  <td className={'boy-sht td-entr'}>Шт</td>
                                </tr>
                              </table>
                            </>
                          ) : keys == 'Кор№' ? (
                            <>
                              <table>
                                <tr>
                                  <td className="td-top" colSpan={3}>
                                    <div className="row">
                                      <div className="col-7"> Корона№</div>
                                      <div className="col-5">
                                        <input
                                          type="text"
                                          className="input-num "
                                          {...register('КоронаНум')}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="tr-top">
                                  <td className={'boy td-entr'}>Бойы</td>

                                  <td className={'boy-sht td-entr'}>Шт</td>
                                </tr>
                              </table>
                            </>
                          ) : keys == 'Добор-Бойы' ? (
                            <>
                              <table>
                                <tr>
                                  <td colSpan={3}>Добор</td>
                                </tr>
                                <tr className="tr-top">
                                  <td className="boyin"> Бойы</td>

                                  <td className="eni">Ени</td>

                                  <td className="shts">шт</td>
                                </tr>
                              </table>
                            </>
                          ) : (
                            <>{keys}</>
                          )}
                        </font>
                      </th>
                    </>
                  ))}
                <th>
                  <a
                    className="btn-sm btn-add "
                    onClick={() =>
                      setCount((prev) => [...prev, prev.at(-1) + 1])
                    }
                  >
                    <i class="bi bi-plus-square"></i>
                  </a>
                </th>
              </tr>
            </thead>

            <tbody>
              {count.map((i) => (
                <tr key={i}>
                  {typesVlt
                    .filter((teg) => teg !== 'Нал№')
                    .filter((teg) => teg !== 'Кор№')
                    .map((keys, index) => (
                      <td key={index}>
                        <input
                          className={keys + ' input-border'}
                          // className={'input-teg'}

                          type="text"
                          {...register(keys + '_' + i)}
                        />
                      </td>
                    ))}
                  <td className="text-center">
                    <i
                      className="bi bi-file-x x-del"
                      onClick={() => delTabel(i)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </>
  )
}

export default Form
