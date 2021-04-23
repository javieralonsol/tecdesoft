import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import Chart from 'react-google-charts';

import { AuthContext } from '../components/providers/AuthProvider.js';

const strPad = (text, maxLength, symbol, left = true) => {
  const repeated = symbol.repeat(maxLength - text.toString().length);
  return (left ? repeated : '') + text + (!left ? repeated : '');
};

const spanishMonths = {
  Jan: 'Enero',
  Feb: 'Febrero',
  Mar: 'Marzo',
  Apr: 'Abril',
  May: 'Mayo',
  Jun: 'Junio',
  Jul: 'Julio',
  Aug: 'Agosto',
  Sep: 'Septiembre',
  Oct: 'Octubre',
  Nov: 'Noviembre',
  Dec: 'Diciembre',
};

export default function InformPage({ setModalContent }) {
  const [user, setUser] = useContext(AuthContext);
  const [dataArray, setDataArray] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user.token) {
      return <Redirect to="/" />;
    }

    (async () => {
      const loginFetchResponse = await fetch(
        `https://test-api-d93b7-default-rtdb.firebaseio.com/data.json?auth=${user.token}`
      );

      if (!loginFetchResponse) {
        setErrorMsg('Sin respuesta');
      } else {
        const loginFetch = await loginFetchResponse.json();

        if (loginFetch.error === 'Auth token is expired') {
          setUser({ token: '' });
        } else if (loginFetchResponse.status !== 200) {
          setErrorMsg(`Error!!! ${loginFetch.error}`);
        }

        const tablesArray = [];
        const tableAll = [];
        for (const eachTable in loginFetch) {
          tablesArray[eachTable] = [];
          for (const item of loginFetch[eachTable]) {
            tablesArray[eachTable].push([new Date(item.Date), item.Value]);
            if (!tableAll[item.Date]) {
              tableAll[item.Date] = [];
            }
            tableAll[item.Date].push(item.Value);
          }
        }

        tablesArray['ALL'] = Object.entries(tableAll).map((table) => [new Date(table[0]), ...table[1]]);

        setDataArray(tablesArray);
      }
    })();
  }, []);

  useEffect(() => {
    document.addEventListener('dblclick', (event) => {
      const eTarget = event.target;

      if (eTarget.matches('.informTable td')) {
        const tds = [...eTarget.closest('tr').children];
        const tdDateArray = tds[1].innerText.replace(',', '').split(' ');
        const tdDate = `${tdDateArray[1]} de ${spanishMonths[tdDateArray[0]]} de ${tdDateArray[2]}`;
        const tdsArray = tds.slice(2);
        const valuesArray = tdsArray.map((td) => parseInt(td.innerText));
        const valuesSum = valuesArray.reduce((acc, number) => (acc += number), 0);

        setModalContent(
          `<b>${tdDate}</b><br /><br />${strPad('Máximo:', 11, '&nbsp;', false)} ${strPad(
            Math.max(...valuesArray),
            5,
            '&nbsp;'
          )}<br />${strPad('Mínimo:', 12, '&nbsp;', false)} ${strPad(
            Math.min(...valuesArray),
            5,
            '&nbsp;'
          )}<br />${strPad('Media:', 11, '&nbsp;', false)} ${strPad(
            (valuesSum / valuesArray.length).toFixed(2),
            5,
            '&nbsp;'
          )}<br />${strPad('Suma:', 12, '&nbsp;', false)} ${strPad(valuesSum, 5, '&nbsp;')}`
        );
      }
    });
  }, []);

  return (
    <div>
      {!user.token && <Redirect to="/" />}
      <button className="closeSession" onClick={() => setUser({ token: '' })}>
        Cerrar la sesión
      </button>
      <div className="inform centered">
        {errorMsg && <p class="error">&nbsp;Se ha producido un error: {errorMsg}&nbsp;</p>}
        {Object.entries(dataArray).map((table) => (
          <div className="googlechart centered" key={table}>
            <Chart
              width={'500px'}
              height={'300px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={[
                table[1][0].length === 2
                  ? [{ type: 'date', label: 'Day' }, table[0]]
                  : [{ type: 'date', label: 'Day' }, 'HG', 'HM', 'HR'],
                ...table[1],
              ]}
              options={{
                curveType: 'function',
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </div>
        ))}
        <div className="googlechart informTable centered" key="informTable">
          <Chart
            chartType="Table"
            data={[
              [
                { type: 'date', label: 'Date' },
                { type: 'number', label: 'HG' },
                { type: 'number', label: 'HM' },
                { type: 'number', label: 'HR' },
              ],
              ...(dataArray['ALL'] || []),
            ]}
            loader={<div>Loading Chart</div>}
            options={{
              showRowNumber: true,
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      </div>
      <p></p>
    </div>
  );
}
