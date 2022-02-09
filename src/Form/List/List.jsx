import { useEffect, useMemo, useRef, useState } from 'react'
import str, { dataType } from '../../data/data'
import { Aksesuar } from '../Aksesuar'
import { Dovogor } from '../Dogovor/Dovogor'
import Form from '../From'

export const List = (props) => {
  const [m2, setM2] = useState(1)

  const [selecData, setSelectData] = useState({
    type: 'Ламинат',
    parameters: dataType.Ламинат,
  })

  const [info, setInfo] = useState({
    type: 'Узор',
    parameters: selecData.parameters.Узор,
  })
  const [nalich, setNalich] = useState(+info.parameters.Наличник.цена)

  const changeSelect = (event) => {
    setSelectData({
      type: event.target.value,
      parameters: dataType[event.target.value],
    })
  }

  useEffect(() => {
    let dataTypeUri = selecData.parameters[info.type]
      ? info.type
      : selecData.type == 'Универсальный'
      ? 'нет'
      : 'Узор'

    setInfo({
      type: dataTypeUri || 'Узор',
      parameters: selecData.parameters[dataTypeUri],
    })
  }, [selecData.parameters])

  const [nalichPrice, setNalichPrice] = useState(1)
  const [dataEvent, setEvent] = useState('Узор')
  const changeParam = (event) => {
    setEvent(event.target.value)
    setInfo({
      type: event.target.value,
      parameters: {
        ...selecData.parameters[event.target.value],
        Наличник: {
          цена: nalichPrice,
        },
      },
    })
  }
  useEffect(() => {
    let uriSet = selecData.parameters[dataEvent] ? dataEvent : 'нет'

    changeParam({ target: { value: info.type } })
    console.log(nalichPrice)
  }, [nalichPrice])

  const [objPrice, setobjPrice] = useState({
    Двери: 0,
    Карона: 0,
    Наличник: 0,
    Добор: 0,
    Кубик: 0,
    Ночка: 0,
  })
  const [m2Data, setm2Data] = useState({
    dverm2: 0,
    karonaM: 0,
    nalichnikv2: 0,
    doborKvmetr: 0,
    KubikSht: 0,
    NochkaSht: 0,
  })

  const [infoTabe, getTabelInfo] = useState({ data: {}, count: [1] })

  useEffect(() => {
    setobjPrice((prev) => ({
      ...prev,
      Двери: m2 * +info.parameters.Двери.цена,
    }))
    setInfo({ ...info, parameters: { ...info.parameters } })
  }, [m2, info.parameters.Двери.цена])

  const [infoZakaz, setInfoZakaz] = useState({
    ЗаказID: window.orderId,
    Замерщик: '',
  })
  const [sum, setSum] = useState(0)
  const [aksesData, setAksesData] = useState({})
  const zakazRef = useRef(null)
  const [extra, setExtra] = useState('')
  return (
    <div>
      <div className="row" ref={zakazRef}>
        <div className="col-md-2">
          <input
            type="text"
            value={infoZakaz.ЗаказID}
            onChange={(e) =>
              setInfoZakaz((prev) => ({ ...prev, ЗаказID: e.target.value }))
            }
            placeholder="Заказ ID"
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            value={infoZakaz.Замерщик}
            onChange={(e) =>
              setInfoZakaz((prev) => ({ ...prev, Замерщик: e.target.value }))
            }
            placeholder="Замерщик"
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select col-md-4"
            aria-label="Default select example "
            onChange={changeSelect}
          >
            {Object.keys(dataType).map((typ, index) => (
              <option
                key={index}
                value={selecData.type == typ ? selecData.type : typ}
              >
                {typ}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select col-md-4"
            aria-label="Default select example "
            onChange={changeParam}
          >
            {Object.keys(selecData.parameters).map((typ, index) => (
              <option value={typ} key={index}>
                {typ}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="tabelInfo">
        <Form
          zakazRef={zakazRef}
          setM2={setM2}
          info={info}
          setInfo={setInfo}
          nalich={nalich}
          setNalich={setNalich}
          selecData={selecData}
          setobjPrice={setobjPrice}
          setNalichPrice={setNalichPrice}
          setm2Data={setm2Data}
          getTabelInfo={getTabelInfo}
        />
      </div>

      <br />

      <div className="container">
        <textarea
          placeholder="КОСЫМША:"
          rows={3}
          onChange={(e) => setExtra(e.target.value)}
          className="kosimsha"
        ></textarea>
        <br />
        <br />
        <div className="row">
          <div className="col">
            <table className="table-mine table-bordered">
              <thead>
                <tr>
                  <th className="col-1 " scope="col">
                    <font size="2"> Название </font>
                  </th>
                  <th className="col-1 " scope="col">
                    <font size="2">
                      м<sup>2</sup>
                    </font>
                  </th>

                  <th className="col-1 " scope="col">
                    <font size="2"> Цена</font>
                  </th>
                  <th className="col-1 " scope="col">
                    <font size="2"> Сумма</font>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(info.parameters).map((inf, index) => (
                  <tr key={index}>
                    <td className="col-1 ">{inf}</td>
                    <td className="col-0.1">
                      {Object.values(m2Data)[index].toLocaleString()}
                    </td>
                    <td>
                      <input
                        className="input-border"
                        type="text"
                        onChange={(event) => {
                          setInfo((prev) => ({
                            ...prev,
                            parameters: {
                              ...prev.parameters,
                              [inf]: {
                                ...prev.parameters[inf],
                                цена: event.target.value,
                              },
                            },
                          }))
                        }}
                        value={info.parameters[inf].цена}
                      />
                    </td>
                    <td>
                      {inf == 'Двери'
                        ? objPrice.Двери.toLocaleString()
                        : inf == 'Наличник'
                        ? objPrice.Наличник.toLocaleString()
                        : inf == 'Карона'
                        ? objPrice.Карона.toLocaleString()
                        : inf == 'Добор'
                        ? objPrice.Добор.toLocaleString()
                        : inf == 'Кубик'
                        ? objPrice.Кубик.toLocaleString()
                        : inf == 'Ночка' && objPrice.Ночка.toLocaleString()}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="2">
                    <h5 style={{ textAlign: 'center' }}>
                      <b> Общий итого</b>
                    </h5>
                  </td>
                  <td colSpan="2" className="summa_b">
                    <b>
                      {Object.values(objPrice)
                        .reduce((a, b) => a + b)
                        .toLocaleString() + ' сум'}
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col">
            <Aksesuar
              sum={sum}
              setSum={setSum}
              objPriceDver={objPrice}
              setAksesData={setAksesData}
            />
          </div>
        </div>
        <Dovogor
          aksesSum={sum}
          objPriceDver={objPrice}
          infoTabe={infoTabe}
          extra={extra}
          info={{
            objPrice,
            m2Data,
            info: info.parameters,
            totol: Object.values(objPrice).reduce((a, b) => a + b),
          }}
          infoZakaz={{
            ...infoZakaz,
            typeDver: selecData.type,
            typePattern: info.type,
          }}
          aksesData={aksesData}
        />
      </div>
    </div>
  )
}
