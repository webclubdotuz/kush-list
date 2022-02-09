import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dovogor } from './Dogovor/Dovogor'

export const aksTypes = [
  'Замок_1',
  'Замок_2',
  'Защелка',
  'Шпингалет',
  'Петля',
  'Стопер',
  'СТЕКЛО',
  'ДЕКОР',
]
export const Aksesuar = ({ sum, setSum, setAksesData }) => {
  const { register, handleSubmit, watch, formState, setValue, getValues } =
    useForm({ mode: 'onChange' })
  const getValIndex = (teg) => aksTypes.map((name) => name + teg)
  const WatchAdd = (teg) => {
    return aksTypes.map((e) => watch(e + teg))
  }

  const totoalReduxe = (nameTeg) => {
    return nameTeg.reduce(
      (previousValue, currentValue) =>
        previousValue + +currentValue.replace(/\s/g, ''),
      0
    )
  }

  useEffect(() => {
    aksTypes.forEach((teg) => {
      setValue(
        teg + '_summa',
        (+watch(teg + '_price') * +watch(teg)).toLocaleString()
      )
    })
    setAksesData(getValues())
  }, [...WatchAdd(''), ...WatchAdd('_price')])

  useEffect(() => {
    console.log(WatchAdd('_summa'))
    setSum(totoalReduxe(getValues(getValIndex('_summa'))) || 0)
    setAksesData(getValues())
  }, WatchAdd('_summa'))

  return (
    <>
      <div>
        <div className="row">
          <div className="col">
            <table className="table-bordered">
              <thead>
                <tr>
                  <th colSpan="3" style={{ textAlign: 'center' }}>
                    <font size="2">Аксессуары </font>
                  </th>
                  <th colSpan="4" style={{ textAlign: 'center' }}>
                    <font size="2"> Сум </font>
                  </th>
                </tr>
              </thead>
              <tbody>
                {aksTypes.map((types, index) => (
                  <tr key={index}>
                    <td>{types}</td>
                    <td>
                      <input
                        className="input-border"
                        // className={'zamok_summ'}
                        type="text"
                        {...register(types)}
                      />
                    </td>
                    <td>
                      <input
                        className="input-border"
                        type="text"
                        {...register(types + '_price')}
                      />
                    </td>
                    <td>
                      <input
                        className="input-border"
                        type="text"
                        {...register(types + '_summa')}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    {/* <font size="2"> */}
                    <b> Сумма аксессуары </b>
                    {/* </font> */}
                  </td>
                  <td colSpan="4" className="summa_b">
                    <b>{sum.toLocaleString()}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* <Dovogor aksesSum={sum} objPriceDver={objPriceDver} /> */}
      </div>
    </>
  )
}
