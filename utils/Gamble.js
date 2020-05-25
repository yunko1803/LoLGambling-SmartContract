// import web3 from './web3';
// import Gamble from '../build/contracts/Betting.json';

// export default (address) => {
// 	return new web3.eth.Contract(JSON.parse(Gamble.interface), address);
// };

import web3 from './web3';
import Gamble from '../build/contracts/Gamble.json';

export default (address) => {
	return new web3.eth.Contract(Gamble.abi, address);
};
