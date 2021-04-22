import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import Chart from 'react-google-charts';
// import { useHistory } from 'react-router';

import { AuthContext } from '../components/providers/AuthProvider.js';

export default function InformPage() {
  const [user, setUser] = useContext(AuthContext);
  // eslint-disable-next-line
  const [dataArray, setDataArray] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  console.log('Pintando InformPage');

  // const history = useHistory();

  useEffect(() => {
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
          setErrorMsg(`Error!!! ${await loginFetchResponse.text()}`);
        }

        console.log(6666, loginFetch);
        // const grapfGoogleCharts = [];
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
            // tablesArray['union'][item.Date]?.push(item.Value);

            // console.log(item);
          }
          //  loginFetch[eachTable].map(() =>)
          //   console.log(loginFetch[eachTable]);
          //   // loginFetch[eachTable];
          // grapfGoogleCharts.push([loginFetch[eachTable][0].Date]);
        }
        console.log(7890, tableAll);
        const tableAll2 = Object.entries(tableAll).map((table) => [new Date(table[0]), ...table[1]]);
        tablesArray['ALL'] = tableAll2;

        setDataArray(tablesArray);
        console.log(123456, tableAll2);
        // console.log(grapfGoogleCharts);
        //const graficArray = loginFetch.map((item) => item)
        // const pru = Object.entries(loginFetch).map((table) => {
        //   [new Date(table[1].Date), [...table[1].map((item) => item.Value)]];
        // });
        // console.log(pru);
        // setDataArray(pru);
        // return () => {
        //   cleanup
        // }
      }
    })();
  }, []);
  console.log(888, dataArray);
  Object.entries(dataArray).map((table) => {
    console.log(999, table);
  });

  return (
    <div>
      <h1>Informe</h1>
      {!user.token && <Redirect to="/" />}
      {errorMsg && <div>Se ha producido un error: {errorMsg}</div>}
      {Object.entries(dataArray).map((table) => (
        <Chart
          key={table}
          width={'600px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            table[1][0].length === 2
              ? [{ type: 'date', label: 'Day' }, table[0]]
              : [{ type: 'date', label: 'Day' }, 'HG', 'HM', 'HR'],
            ...table[1],
          ]}
          options={{
            hAxis: {
              title: 'Time',
            },
            vAxis: {
              title: 'Ammount',
            },
            curveType: 'function',
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      ))}

      <Chart
        width={'500px'}
        height={'300px'}
        chartType="Table"
        loader={<div>Loading Chart</div>}
        data={[
          [
            { type: 'string', label: 'Name' },
            { type: 'number', label: 'Salary' },
            { type: 'boolean', label: 'Full Time Employee' },
          ],
          ['Mike', { v: 10000, f: '$10,000' }, true],
          ['Jim', { v: 8000, f: '$8,000' }, false],
          ['Alice', { v: 12500, f: '$12,500' }, true],
          ['Bob', { v: 7000, f: '$7,000' }, true],
        ]}
        options={{
          showRowNumber: true,
        }}
        rootProps={{ 'data-testid': '1' }}
      />

      <button onClick={() => setUser({ token: '' })}>Cerrar la sesión</button>
    </div>
  );
}
