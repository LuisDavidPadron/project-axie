import React, { Fragment } from 'react';
import axios from 'axios';
import SearchAddress from './components/search';
import ListSchools from './components/list';
import { differenceInDays,formatDistance } from 'date-fns'
import { Container } from '@material-ui/core';
import { es } from 'date-fns/locale'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.days = 14

    this.state = {
      becados: [],      
      classes: makeStyles( (theme) => {
        createStyles({
          table: {
            minWidth: 650,
          },
          popover: {
            pointerEvents: 'none',
          },
          paper: {
            padding: theme.spacing(1),
          },
      })})
    };

    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    // this.setState({
    //   becados: JSON.parse(localStorage.getItem('Schoolars'))
    // });
    this.getData()
  }
  
  componentWillUnmount() {
    // this.setState({
    //   becados: JSON.parse(localStorage.getItem('Schoolars'))
    // });
    this.getData()
  }
  
  addDays = (days, dayCobradoEpoch) => {
    var d = new Date(0)

    d.setUTCSeconds(dayCobradoEpoch)
    d.setDate(d.getDate() + days);
    
    return formatDistance(d, new Date(), { addSuffix: true, locale: es});
  }

  useStyles = () => {
    makeStyles( (theme) => {
      createStyles({
        table: {
          minWidth: 650,
        },
        popover: {
          pointerEvents: 'none',
        },
        paper: {
          padding: theme.spacing(1),
        },
      })
    })
  }

  getData = async () => {
    let becados = JSON.parse(localStorage.getItem('Schoolars'))

    if(becados){
      let refreshBecados = []
      await becados.forEach( async (becado) => {      
        if(becado.wallet){

          let response = await Promise.all([
              await axios.get(`https://api.lunaciarover.com/stats/${becado.wallet}`)
          ])

          let totalRemain = response[0].data.in_game_slp
          
          var d = new Date(0)

          d.setUTCSeconds(response[0].data.last_claim_timestamp)
          
          await refreshBecados.push({
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
              percentajeStudent: becado.percentajeStudent,
              percentajeSchool: becado.percentajeSchool,
              receiveStudent: ( becado.percentajeStudent * response[0].data.total_slp) / 100,
              receiveSchoolar: ( becado.percentajeSchool * response[0].data.total_slp) / 100,
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
        <Container>
          <h1>Schoolars Axie Infinity</h1>
          <SearchAddress parentCallback={ this.getData.bind(this) } />          
          <TableContainer>
            <Table className={this.state.classes.table} aria-label="caption table">
              <TableHead>
                <TableCell>Axies</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Total Reunido</TableCell>
                <TableCell>Total Retirar</TableCell>
                <TableCell>Promedio</TableCell>                  
                <TableCell>Next claim</TableCell>
                <TableCell>Last claim</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Trophies</TableCell>                  
                <TableCell>Retiro Schoolar</TableCell>
                <TableCell>Retiro Becado</TableCell>                
              </TableHead>
              { this.state.becados.map( (row) => (<ListSchools becado={ row } />) )}          
            </Table>
          </TableContainer>         
        </Container>        
      </Fragment>    
    );
  }
}