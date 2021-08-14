import React, { Component } from "react";
import axios from 'axios';
import { createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Popover from '@material-ui/core/Popover';
import { withStyles } from "@material-ui/styles";

const theme = createMuiTheme({
  spacing: 4
});

const styles = {
  typography: {
    padding: theme.spacing(2)
  }
};
class SimplePopover extends Component {
  constructor(props) {
    super(props);
    this.state = { anchorEl: null, open: false, axies: [] };
  }
  
  componentDidMount(){
    // this.getAxies().then( res)
  }

  flipOpen = () => this.setState({ ...this.state, open: !this.state.open });

  handleClick = async(event) => {  
    // console.log(this.props.wallet)

    
      /**
       * EJECUTAR LAS SIGUIENTES
       * 
       * Ruta Para consultar axies de una ronin wallet
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

    this.state.ancherEl
      ? this.setState({ ancherEl: null })
      : this.setState({ ancherEl: event.currentTarget });
    this.flipOpen();
  };

  getAxies = async() => {
    let response = Promise.all([
      axios.get(`https://axieinfinity.com/graphql-server-v2/graphql?query=%7Bscholscholarxx:axies(owner:%220x27ca854ac4a192d7078896aba38339fae93e3887%22)%7Bresults%7B...AxieBrief%7D%7D%7Dfragment%20AxieBrief%20on%20Axie%7Bid%7D`)
    ])

    console.log(response)
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div>
         <Button aria-describedby={this.state.open ? "simple-popper" : null} variant="contained" color="primary" onClick={this.handleClick}>
        Axies
      </Button>
      <Popover
        id={ this.state.open ? "simple-popper" : null}
        open={this.state.open}
        anchorEl={this.state.ancherEl}
        onClose={this.handleClick}
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
      </div>
    );
  }
}

export default withStyles(styles)(SimplePopover);