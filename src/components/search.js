import React from "react";
import axios from 'axios';
import { differenceInDays, formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import { makeStyles ,Container, TextField, Box, Button } from '@material-ui/core';

export default class SearchAddress extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        value: '',
        percentajeSchool: 100,
        percentajeStudent: 0        
      };

            
      this.useStyles = makeStyles(theme => ({
        button: {
          margin: '1rem 1rem 1rem 1rem'
        },
        inputs :{
          margin: theme.spacing(1)
        }
      }));

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
      return formatDistance(d, new Date(), { addSuffix: true, locale: es});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let response = await Promise.all(
          [
            await axios.get(`https://api.lunaciarover.com/stats/${this.state.value}`)
          ]
        )
        let totalRemain = response[0].data.in_game_slp

        var d = new Date(0)
        d.setUTCSeconds(response[0].data.last_claim_timestamp)
      
        if(!localStorage.getItem('Schoolars')){
            let user = [];
            user.push({
              totalParaRetirar : response[0].data.ronin_slp,
              totalReunido : response[0].data.total_slp,
              promedioSlpDiario : parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro : this.addDays(this.days, response[0].data.last_claim_timestamp),
              ultimoDiaCobrado : d,
              daily: response[0].data.in_game_slp,//response[0].data.total !== becado.totalReunido ? response[0].data.total - becado.totalReunido : becado.daily,
              rank : response[0].data.rank,
              elo : response[0].data.mmr,
              name: response[0].data.ign,
              wallet: response[0].data.ronin_address,
              percentajeStudent: this.state.percentajeStudent,
              percentajeSchool: this.state.percentajeSchool,
              receiveStudent: ( this.state.percentajeStudent * response[0].data.total_slp) / 100,
              receiveSchoolar: ( this.state.percentajeSchool * response[0].data.total_slp) / 100
            })                      
            localStorage.setItem('Schoolars', JSON.stringify(user))
            this.props.parentCallback('ejecutado')
        } else {
          let users = JSON.parse(localStorage.getItem('Schoolars') || '[]')
          console.log(users, this.state.value)
          if(!users.some(user => user.wallet === this.state.value)){            
            users.push({
             
              totalParaRetirar : response[0].data.ronin_slp,
              totalReunido : response[0].data.total_slp,
              promedioSlpDiario : parseInt(totalRemain/differenceInDays(new Date(), d)),
              fechaCobro : this.addDays(this.days, response[0].data.last_claim_timestamp),
              ultimoDiaCobrado : d,
              daily: response[0].data.in_game_slp,//response[0].data.total !== becado.totalReunido ? response[0].data.total - becado.totalReunido : becado.daily,
              rank : response[0].data.rank,
              elo : response[0].data.mmr,
              name: response[0].data.ign,
              wallet: response[0].data.ronin_address,
              percentajeStudent: this.state.percentajeStudent,
              percentajeSchool: this.state.percentajeSchool,
              receiveStudent: ( this.state.percentajeStudent * response[0].data.total_slp) / 100,
              receiveSchoolar: ( this.state.percentajeSchool * response[0].data.total_slp) / 100
            })
            localStorage.setItem('Schoolars', JSON.stringify(users))
            this.props.parentCallback()
          } else {
            alert('No se puede agregar una cuenta ya agregada. Favor agregar otra')
          }
        }
        
        event.preventDefault();
    }
  
    render() {
      return (
        <Container className={this.useStyles.inputs}>
          <form onSubmit={ this.handleSubmit }>
            <Box m={2}>
              <TextField 
                id="outlined-basic" 
                value={this.state.value} 
                onChange={this.handleChangeValue} 
                label="Ronin address" 
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                variant="outlined" />
              <TextField 
                type="number" 
                id="outlined-basic" 
                value={this.state.percentajeSchool} 
                onChange={this.handleChangeSchool} 
                label="Porcentaje Schoolar" 
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                variant="outlined" />
              <TextField  type="number" id="outlined-basic"  max="100" value={this.state.percentajeStudent} onChange={this.handleChangeStudent} label="Porcentaje Becado" variant="outlined" />          
            </Box>
            <Box m={2}>
              <Button className={ this.useStyles.button } type="submit" variant="contained" color="primary">Buscar</Button>          
            </Box>                  
          </form>
        </Container>       
      );
    }
}