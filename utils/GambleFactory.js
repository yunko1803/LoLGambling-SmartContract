import web3 from './web3';
import GambleFactory from '../build/contracts/GambleFactory.json';

const address = '0x7A65eAe5903b6ED89CFa8d356B846F5061eFD0d3';
const abi = GambleFactory.abi;

export default new web3.eth.Contract(abi, address);
