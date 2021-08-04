import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns'

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';


export default class ListSchools extends React.Component {  
  
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      open: false
    };    

    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);    
  }

  componentWillUpdate (){
    /**
     * EJECUTAR LAS SIGUIENTES
     * 
     * Ruta Para consultar axies de una ronin wallet
     * https://axieinfinity.com/graphql-server-v2/graphql?query=%7Bscholscholarxx:axies(owner:%220x27ca854ac4a192d7078896aba38339fae93e3887%22)%7Bresults%7B...AxieBrief%7D%7D%7Dfragment%20AxieBrief%20on%20Axie%7Bid%7Dief on Axie{id}
     * 
     */

    /**
     * 
     *  Envia datos del axie y la imagen de este
      
      https://axieinfinity.com/graphql-server-v2/graphql
      Body para consultar
      {
        "operationName": "GetAxieDetail",
        "variables": {
          "axieId": "408698"
        },
        "query": "query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n image\n  breedCount\n  stats {\n    ...AxieStats\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n"
      }
    
     * 
     */

  }

  handlePopoverOpen (event) {
    // console.log(idWallet)
    this.setState({
      anchorEl: event.currentTarget,
      open: Boolean(event.currentTarget)
    });
  }

  handlePopoverClose () { 
    this.setState({
      anchorEl: null,
      open: false
    });
  }

  roninWallet(id){
    console.log(id)
  }

  render() {
    const classes = makeStyles( (theme) => {
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

    if(this.props.becados){
      return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="caption table">
            <TableHead>
              <TableRow>
                <TableCell>Total Para Retirar</TableCell>
                <TableCell align="right">Total Reunido</TableCell>
                <TableCell align="right">Promedio Slp Diario</TableCell>
                <TableCell align="right">Fecha de Cobro</TableCell>
                <TableCell align="right">Ultimo Dia de cobro</TableCell>
                <TableCell align="right">Generado Hoy</TableCell>                      
                <TableCell align="right">Rank</TableCell>
                <TableCell align="right">Trophies</TableCell>
                <TableCell align="right">Victorias</TableCell>
                <TableCell align="right">Derrotas</TableCell>
                <TableCell align="right">Empates</TableCell>
                <TableCell align="right">Retiro Schoolar</TableCell>
                <TableCell align="right">Retiro Becado</TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              { this.props.becados.map((row) => (                                                            
                <TableRow key={row.wallet}>           
                  <TableCell>
                    <Button aria-describedby={this.open ? 'simple-popover' : undefined} variant="contained" color="primary" onClick={this.handlePopoverOpen}>
                      Open Popover
                    </Button>
                    <Popover
                      id={ this.open ? 'simple-popover' : undefined }
                      open={this.open}
                      anchorEl={this.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Typography className={classes.typography}>The content of the Popover.</Typography>
                    </Popover>
                  </TableCell>
                  <TableCell align="right">{ row.totalParaRetirar}</TableCell>
                  <TableCell align="right">{ row.totalReunido}</TableCell>
                  <TableCell align="right">{ row.promedioSlpDiario}</TableCell>
                  <TableCell align="right">{ row.fechaCobro }</TableCell> 
                  <TableCell align="right">{ format(new Date(row.ultimoDiaCobrado), 'MM/dd/yyyy') }</TableCell>
                  <TableCell align="right">{ row.daily === row.totalReunido ? 0 : row.daily }</TableCell>
                  <TableCell align="right">{ row.rank }</TableCell>
                  <TableCell align="right">{ row.elo }</TableCell>
                  <TableCell align="right">{ row.win_total }</TableCell>
                  <TableCell align="right">{ row.lose_total }</TableCell>
                  <TableCell align="right">{ row.draw_total }</TableCell>
                  <TableCell align="right">{ row.receiveSchoolar }</TableCell>                  
                  <TableCell align="right">{ row.receiveStudent }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>     
      );
    } else {
      return (
        <p>Sin Becados</p>
      )
    }
  }
}
