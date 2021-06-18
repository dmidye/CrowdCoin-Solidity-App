import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        // summary is returned as an object
        // example:
        // '0': '100',
        // '1': '0',
        // '2': '0',
        // '3': '0',
        // '4': '0x4CD172bDA20fCf1631f05D6f3c52821b92c57546'
        // below we process the object into something more informative
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {balance, manager, minimumContribution, requestCount, approversCount} = this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'Manager can create requests to withdraw Ether',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'Must contribue this much wei to be an approver'
            },
            {
                header: requestCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'How much money this campaign has left to spend.'
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout> 
                <h3> Campaign Show </h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="10">
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width="6">
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                 
            </Layout>
            
        )
    }
}

export default CampaignShow;