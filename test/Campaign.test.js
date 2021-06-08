const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


let accounts; // list of accounts ganache provides to us
let factory; // deployed instance of campaign factory
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe ('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5', // should throw error
                from: accounts[1]
            });
            assert(false); // if code gets to this point, fail the test
        } catch (err) {
            assert(err);
        }
    });

    // it('manager can create payment request', async () => {
    //     await campaign.methods.
    //         createRequest('test description', '100', accounts[1]).send({
    //             from: accounts[0], // this is manager account and only manager can create requests
    //             gas: '1000000'
    //     });

    //     const request = await campaign.methods.requests(0).call();
    //     assert.strictEqual('test description', request.description);
    // });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('test description', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0], // this is manager account and only manager can create requests
                gas: '1000000'
            });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        
        let balance = await web3.eth.getBalance(accounts[1]); // this returns a string represent the amount of ether in account
        balance = web3.utils.fromWei(balance, 'ether'); // converting to ether
        balance = parseFloat(balance); // turning balance into a float

        assert(balance > 104);

    });
});