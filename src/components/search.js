import React from "react";
import axios from 'axios';
import { differenceInDays } from 'date-fns'

export default class SearchAddress extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        value: '',
        percentajeSchool: 100,
        percentajeStudent: 0        
      };

      this.days = 14;

      this.handleChangeValue = this.handleChangeValue.bind(this);
      
      this.handleChangeSchool = this.handleChangeSchool.bind(this);
      
      this.handleChangeStudent = this.handleChangeStudent.bind(this);

      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeValue(event) {      
      this.setState({
        value: '0x' + event.target.value.split('ronin:')[1]
      });
    }

    handleChangeSchool(event) { 
      this.setState({
        percentajeStudent: 100 - event.target.value,
        percentajeSchool: parseInt(event.target.value)
      });
    }

    handleChangeStudent(event) { 
      this.setState({
        percentajeSchool: 100 - event.target.value,
        percentajeStudent: parseInt(event.target.value)
      });

      
    }

    addDays(days, dayCobradoEpoch) {
      var d = new Date(0)

      d.setUTCSeconds(dayCobradoEpoch)
      d.setDate(d.getDate() + days);
      return d;
    }

    async handleSubmit(event) {
        event.preventDefault();
        let response = await Promise.all(
          [
            await axios.get(`https://lunacia.skymavis.com/game-api/clients/${this.state.value}/items/1`),
            await axios.get(`https://lunacia.skymavis.com/game-api/leaderboard?client_id=${this.state.value}&offset=0&limit=0`)
          ]
        )
        let totalRemain = response[0].data.claimable_total > 0 ? response[0].data.total - response[0].data.claimable_total : response[0].data.total

        console.log(response)
        var d = new Date(0)
        d.setUTCSeconds(response[0].data.last_claimed_item_at)
      
        if(!localStorage.getItem('Schoolars')){
            let user = [];
            user.push({
              totalParaRetirar: response[0].data.claimable_total,
              totalReunido: response[0].data.total,
              promedioSlpDiario: parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro: this.addDays(this.days, response[0].data.last_claimed_item_at),
              ultimoDiaCobrado: d,
              wallet: this.state.value,
              percentajeStudent: this.state.percentajeStudent,
              percentajeSchool: this.state.percentajeSchool,
              rank: response[1].data.items[0].rank,
              elo: response[1].data.items[0].elo,
              win_total: response[1].data.items[0].win_total,
              lose_total: response[1].data.items[0].lose_total,
              draw_total: response[1].data.items[0].draw_total,
            })                      
            localStorage.setItem('Schoolars', JSON.stringify(user))
        } else {
          let users = JSON.parse(localStorage.getItem('Schoolars') || '[]')
          if(!users.some(user => user.wallet === this.state.value)){            
            users.push({
              totalParaRetirar: response[0].data.claimable_total,
              totalReunido: response[0].data.total,
              promedioSlpDiario: parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro: this.addDays(this.days, response[0].data.last_claimed_item_at),
              ultimoDiaCobrado: d,
              wallet: this.state.value,
              percentajeStudent: this.state.percentajeStudent,
              percentajeSchool: this.state.percentajeSchool,
              rank: response[1].data.items[0].rank,
              elo: response[1].data.items[0].elo,
              win_total: response[1].data.items[0].win_total,
              lose_total: response[1].data.items[0].lose_total,
              draw_total: response[1].data.items[0].draw_total,
            })
            localStorage.setItem('Schoolars', JSON.stringify(users))
          } else {
            alert('No se puede agregar una cuenta ya agregada. Favor agregar otra')
          }
        }
        
        event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Ronin address:
            <input type="text" value={this.state.value} onChange={this.handleChangeValue} />
          </label>
          <br></br>
          <label>
            Porcentaje Schoolar
            <input type="number" value={this.state.percentajeSchool} onChange={this.handleChangeSchool} />
          </label>
          <br></br>
          <label>
            Porcentaje Becado
            <input type="number" value={this.state.percentajeStudent} onChange={this.handleChangeStudent} />
          </label> 
          <br></br>
          <input type="submit" value="Buscar" />
        </form>
      );
    }
}