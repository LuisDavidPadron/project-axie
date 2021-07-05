import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns'

import { makeStyles } from '@material-ui/core/styles';

export default class ListSchools extends React.Component {  
    render() {
        const classes = makeStyles({
            table: {
              minWidth: 650,
            },
          });;
          console.log(this.props)
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
                        <TableCell align="right">{ row.totalParaRetirar}</TableCell>
                        <TableCell align="right">{ row.totalReunido}</TableCell>
                        <TableCell align="right">{ row.promedioSlpDiario}</TableCell>
                        <TableCell align="right">{ format(new Date(row.fechaCobro), 'MM/dd/yyyy') }</TableCell> 
                        <TableCell align="right">{ format(new Date(row.ultimoDiaCobrado), 'MM/dd/yyyy') }</TableCell>
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