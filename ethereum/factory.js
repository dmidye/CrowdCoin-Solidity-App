import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// This file is written so that, every time an instance of the contract is needed, the code below doesn't have
// to be rewritten. Simply import this file instead.
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x3418ac2948A799F761986991D7d04b6BB36E2239' // Address from running deploy script
);

export default instance;