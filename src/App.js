import logo from './logo.svg';
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import SearchAddress from './components/search';
import { differenceInDays } from 'date-fns'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import './App.css';

function App() {
  const days = 14

  const [data, setData] = useState()

  const addDays = (days, dayCobradoEpoch) => {
    var d = new Date(0)

    d.setUTCSeconds(dayCobradoEpoch)
    d.setDate(d.getDate() + days);
    return d;
  }

  const getData = async () => {
    let becados = JSON.parse(localStorage.getItem('Schoolars'))

    if(becados){
      let refreshBecados = []
      await becados.forEach( async (becado) => {      
        if(becado.wallet){
          let response = await Promise.all([
              await axios.get(`https://lunacia.skymavis.com/game-api/clients/${becado.wallet}/items/1`),
              await axios.get(`https://lunacia.skymavis.com/game-api/leaderboard?client_id=${becado.wallet}&offset=0&limit=0`)
          ])
          let totalRemain = response[0].data.claimable_total > 0 ? response[0].data.total - response[0].data.claimable_total : response[0].data.total
          var d = new Date(0)
          d.setUTCSeconds(response[0].data.last_claimed_item_at)
          
          await refreshBecados.push(
            {
              totalParaRetirar : response[0].data.claimable_total,
              totalReunido : response[0].data.total,
              promedioSlpDiario : parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro : addDays(days, response[0].data.last_claimed_item_at),
              ultimoDiaCobrado : d,
              rank : response[1].data.items[0].rank,
              elo : response[1].data.items[0].elo,
              win_total : response[1].data.items[0].win_total,
              lose_total : response[1].data.items[0].lose_total,
              draw_total : response[1].data.items[0].draw_total,
              wallet: response[0].data.client_id     
            }
          )
          console.log(refreshBecados)
          await localStorage.setItem('Schoolars', JSON.stringify(refreshBecados))  
        }         
      });
      setData(localStorage.getItem('Schoolars'))
    } else {
      console.log('no hay')
    }
  }

  function ListItem(props) {
    return (
      <Fragment>
        <li>{props.value.totalParaRetirar}</li>
        <li>{props.value.totalReunido}</li>
        <li>{props.value.promedioSlpDiario}</li>
        <li>{props.value.fechaCobro}</li>
        <li>{props.value.ultimoDiaCobrado}</li>
        <li>{props.value.rank}</li>
        <li>{props.value.elo}</li>
        <li>{props.value.win_total}</li>
        <li>{props.value.lose_total }</li>
        <li>{props.value.draw_total }</li>
      </Fragment>    
    );
  }
  
  function NumberList(props) {  
    const becados = JSON.parse(localStorage.getItem('Schoolars'));
    const listItems = becados.map((becado) =>      
      <ListItem value={becado} />
    );
    return (
      <ul>
        {listItems}
      </ul>
    );
  }


  useEffect( () => {
    getData()     
  },[])

  return (
    <Fragment>
      <h1>Schoolars Axie Infinity</h1>
      <SearchAddress />
      <NumberList lista={data} />,
    </Fragment>    
  );
}

export default App;
