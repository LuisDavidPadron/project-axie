import React from "react";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';


import TableRow from '@material-ui/core/TableRow';

import { format } from 'date-fns'


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
    console.log('hola')
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

  snackMessage(ronin){
    console.log(ronin)
  }

  handlePopoverOpen (event) {
    console.log('hola')
    // this.setState({
    //   anchorEl: event.currentTarget,
    //   open: Boolean(event.currentTarget)
    // });
  }

  handlePopoverClose () { 
    console.log('chao')
    // this.setState({
    //   anchorEl: null,
    //   open: false
    // });
  }

  snackmessage(id){
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


    if(this.props.becado){
      console.log('hola')
      return (        
        <TableBody>
          <TableRow key={this.props.becado.wallet}>        
            <TableCell>{ this.props.becado.name}</TableCell>
            <TableCell align="right">{ this.props.becado.totalReunido }</TableCell>
            <TableCell align="right">{ this.props.becado.totalParaRetirar}</TableCell>                                    
            <TableCell align="right">{ this.props.becado.promedioSlpDiario}</TableCell>                  
            <TableCell align="right">{ this.props.becado.fechaCobro }</TableCell> 
            <TableCell align="right">{ format(new Date(this.props.becado.ultimoDiaCobrado), 'MM/dd/yyyy') }</TableCell>
            <TableCell align="right">{ this.props.becado.rank }</TableCell>
            <TableCell align="right">{ this.props.becado.elo }</TableCell>
            {/* <TableCell align="right">{ this.props.becado.win_total }</TableCell>
            <TableCell align="right">{ this.props.becado.lose_total }</TableCell>
            <TableCell align="right">{ this.props.becado.draw_total }</TableCell> */}
            <TableCell align="right">{ this.props.becado.receiveSchoolar }</TableCell>                  
            <TableCell align="right">{ this.props.becado.receiveStudent }</TableCell>
          </TableRow>
        </TableBody>
      );
    } else {
      return (
        <p>Sin Becados</p>
      )
    }
  }
}
