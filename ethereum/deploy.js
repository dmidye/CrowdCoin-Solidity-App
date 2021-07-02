const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
// Setting up HDWalletProvider
// specify which account we want to unlock and use as source of Ether
// specify what outside node to connect to

const provider = new HDWalletProvider(
    '',
    'https://rinkeby.infura.io/v3/e48309f186ba48398950be097508ecdf'
);

// in inbox.test.js the provider is given to us by ganache, so none of this setup is needed
// this web3 instance is now completely enabled for Rinkeby network
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send( { gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

deploy();


