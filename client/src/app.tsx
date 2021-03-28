import { AnyMxRecord } from 'node:dns';
import React from 'react';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
// import Color from './abis/Color.json';
const Color = require('./abis/Color.json')
import css from './app.css';

declare const web3: Web3;

interface IState {
  account: string;
  error: '' | 'NO_PROVIDER' | 'CONTRACT_NOT_DEPLOYED';
  contract?: Contract;
  colors: string[];
  txt: string;
}
export class App extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      error: '',
      colors: [],
      txt: '',
    }
  }
  public componentDidMount() {
    this.load();
  }
  private async load() {
    try {
      const web3 = window['web3'] = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];

      const networkId = await web3.eth.net.getId();
      const networkData = Color.networks[networkId];
      if (!networkData) {
        throw new Error('Contract not deployed');
        return;
      }
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);

      const totalSupply = await contract.methods.totalSupply().call();
      
      const colors = [];
      for (let i = 0; i < totalSupply; i++) {
        const color = await contract.methods.colors(i).call();
        colors.push(color);
      }
      this.setState({ account, contract, colors });

    } catch (e) {
      console.error(e);
      switch(e.message) {
        case 'Provider not set or invalid': this.setState({ error: 'NO_PROVIDER' }); break;
        case 'Contract not deployed': this.setState({ error: 'CONTRACT_NOT_DEPLOYED' }); break;
        default: this.setState({ error: 'NO_PROVIDER' });
      }
    }
  }
  public async submit(e) {
    e.preventDefault();
    const contract = this.state.contract!;
    const color = this.state.txt;
    contract.methods.mint(this.state.txt).send({ from: this.state.account })
      .once('receipt', (receipt) => this.setState({ colors: [...this.state.colors, color ]}));
  }
  public render() {
    return <>
    {this.state.error === 'NO_PROVIDER' && <> No Provider found </> }
    {this.state.error === 'CONTRACT_NOT_DEPLOYED' && <> Contract not deployed to the network </> }
    {this.state.error === '' && <>
      <div>account: {this.state.account}</div>
      {this.state.colors.map(it => <h1 key={`col-${it}`} style={{color: it}}>{it}</h1>)}

      <form style={{marginTop: 60}} onSubmit={e => this.submit(e)}>
        <input type={"text"} placeholder={'e.g. #ffffff'} value={this.state.txt} onChange={e => this.setState({ txt: e.target.value })} />
        <button type={'submit'}>Submit</button>
      </form>
    </> }
    </>;
  }
}
