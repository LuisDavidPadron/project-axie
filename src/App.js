import React, { Fragment } from 'react';
import axios from 'axios';
import SearchAddress from './components/search';
import ListSchools from './components/list';
import { differenceInDays } from 'date-fns'
import { format } from 'date-fns'


import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.days = 14

    this.state = {
      becados: []
    };

    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    this.getData()
  }
  
  componentWillUnmount() {
    this.getData()
  }
  
  addDays = (days, dayCobradoEpoch) => {
    var d = new Date(0)

    d.setUTCSeconds(dayCobradoEpoch)
    d.setDate(d.getDate() + days);
    return d;
  }

  async getData() {
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
          
          await refreshBecados.push({
              totalParaRetirar : response[0].data.claimable_total,
              totalReunido : response[0].data.total,
              promedioSlpDiario : parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro : this.addDays(this.days, response[0].data.last_claimed_item_at),
              ultimoDiaCobrado : d,
              rank : response[1].data.items[0].rank,
              elo : response[1].data.items[0].elo,
              win_total : response[1].data.items[0].win_total,
              lose_total : response[1].data.items[0].lose_total,
              draw_total : response[1].data.items[0].draw_total,
              wallet: response[0].data.client_id,
              percentajeStudent: becado.percentajeStudent,
              percentajeSchool: becado.percentajeSchool,
              receiveStudent: ( becado.percentajeStudent * response[0].data.claimable_total) / 100,
              receiveSchoolar: ( becado.percentajeSchool * response[0].data.claimable_total) / 100,
          })

          await localStorage.setItem('Schoolars', JSON.stringify(refreshBecados))

          this.setState({
            becados: JSON.parse(localStorage.getItem('Schoolars'))
          });
        }
      });
      
    } else {
      console.log('no hay')
    }
  }


  render(){
    return (
      <Fragment>
        <h1>Schoolars Axie Infinity</h1>
        <SearchAddress parentCallback={ this.getData.bind(this) } />
        <ListSchools becados={ this.state.becados } />
      </Fragment>    
    );
  }
}