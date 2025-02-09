import React, { Component } from 'react';
import { Api, JsonRpc, RpcError } from 'eosjs'; // https://github.com/EOSIO/eosjs
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { TextDecoder, TextEncoder } from 'text-encoding';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// eosio endpoint
const endpoint = "https://sn.eosnode.io";
// http://localhost:8888
// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
 {"name":"cesar", "privateKey":"5KAVVPzPZnbAx8dHz6UWVPFDVFtU1P5ncUzwHGQFuTxnEbdHJL4", "publicKey":"EOS84BLRbGbFahNJEpnnJHYCoW9QPbQEk2iHsHGGS6qcVUq9HhutG"}
 
  //{"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"}
  //{"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
 // {"name":"useraaaaaaac", "privateKey":"5K2jun7wohStgiCDSDYjk3eteRH1KaxUQsZTEmTGPH4GS9vVFb7", "publicKey":"EOS5yd9aufDv7MqMquGcQdD6Bfmv6umqSuh9ru3kheDBqbi6vtJ58"},
 // {"name":"useraaaaaaad", "privateKey":"5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey":"EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X"},
 // {"name":"useraaaaaaae", "privateKey":"5KE2UNPCZX5QepKcLpLXVCLdAw7dBfJFJnuCHhXUf61hPRMtUZg", "publicKey":"EOS7XPiPuL3jbgpfS3FFmjtXK62Th9n2WZdvJb6XLygAghfx1W7Nb"},
 // {"name":"useraaaaaaaf", "privateKey":"5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey":"EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H"},
 // {"name":"useraaaaaaag", "privateKey":"5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo", "publicKey":"EOS8Du668rSVDE3KkmhwKkmAyxdBd73B51FKE7SjkKe5YERBULMrw"}
];
// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0,
  },
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stuffTable: [] // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let status = event.target.status.value;
    let value = event.target.value.value;
    let mValue = event.target.mValue.value;
    let title = event.target.title.value;
    let description = event.target.description.value;
    let category = event.target.category.value;
    let condition = event.target.condition.value;
    let local = event.target.local.value;
    let ships = event.target.ships.value;
    let dNotes = event.target.dNotes.value;
    let mature = event.target.mature.value;
    let pMedia = event.target.pMedia.value;
    let aMedia = event.target.aMedia.value;
    // let note = event.target.note.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "stuffcreate";
        actionData = {
          //user: account,
          //note: note,
          status: status,
          owner: account,
          value: value,
          min_offer_value: mValue,
          title: title,
          description: description,
          category: category,
          condition: condition,
          local: local,
          ships: ships,
          delivery_notes: dNotes,
          mature: mature,
          primary_media: pMedia,
          addl_media: aMedia,
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    try {
      const result = await api.transact({
        actions: [{
          account: "stuff.stuff",
          name: actionName,
          authorization: [{
            actor: account,
            permission: 'active',
          }],
          data: actionData,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });

      console.log(result);
      this.getTable();
    } catch (e) {
      console.log('Caught exception: ' + e);
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2));
      }
    }
  }

  // gets table data from the blockchain
  // and saves it into the component state: "stuffTable"
  getTable() {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "stuff.stuff",   // contract who owns the table
      "scope": "stuff.stuff",  // scope of the table
      "table": "stuff",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ stuffTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { stuffTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, title, description) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {title}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {description}
         </Typography>
          <Typography component="pre"> 
          </Typography>
        </CardContent>
      </Card>
    );
    let stuffCards = stuffTable.map((row, i) =>
      generateCard(i, row.title, row.description));

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              TradeStuff
            </Typography>
          </Toolbar>
        </AppBar>
        {stuffCards}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <TextField
              name="status"
              autoComplete="off"
              label="Status"
              margin="normal"
              fullWidth
            />
            <TextField
              name="value"
              autoComplete="off"
              label="Value"
              margin="normal"
              fullWidth
            />
             <TextField
              name="mValue"
              autoComplete="off"
              label="Min. Offer Value"
              margin="normal"
              fullWidth
            />
            <TextField
              name="title"
              autoComplete="off"
              label="Title"
              margin="normal"
              fullWidth
            />
            <TextField
              name="description"
              autoComplete="off"
              label="Description"
              margin="normal"
              multiline
              rows="3"
              fullWidth
            />
            <TextField
              name="category"
              autoComplete="off"
              label="Category"
              margin="normal"
              fullWidth
            />
            <TextField
              name="condition"
              autoComplete="off"
              label="Condition"
              margin="normal"
              fullWidth
            />
               <TextField
              name="local"
              autoComplete="off"
              label="Local"
              margin="normal"
              fullWidth
            />
               <TextField
              name="ships"
              autoComplete="off"
              label="Ships"
              margin="normal"
              fullWidth
            />
               <TextField
              name="dNotes"
              autoComplete="off"
              label="Delivery Notes"
              margin="normal"
              fullWidth
            />
             <TextField
              name="mature"
              autoComplete="off"
              label="Mature"
              margin="normal"
              fullWidth
            />
                <TextField
              name="pMedia"
              autoComplete="off"
              label="Primary Media"
              margin="normal"
              fullWidth
            />
            <TextField
              name="aMedia"
              autoComplete="off"
              label="Additional Media"
              margin="normal"
              fullWidth
            />
 
   
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit">
              Add / Update note
            </Button>
          </form>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update note:
          <br/><br/>
          accounts = { JSON.stringify(accounts, null, 2) }
        </pre>
      </div>
    );
  }

}

export default withStyles(styles)(Index);
