import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// This file is written so that, every time an instance of the contract is needed, the code below doesn't have
// to be rewritten. Simply import this file instead.
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xd0ad0EC806B35FEb52d2a19F45936190f00C6d06' // Address from running deploy script
);

export default instance;