import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory'; // this is getting the deployed contract
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    // Next requires this getInitialProps method
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call(); //we can now call methods on the contract with react

        return { campaigns };
    }

    // dynamically get address based on which link user clicks
    // address comes from this arrow function iterating over the contracts
    // and creating one of these elements on screen for each contract.
    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (<Link route={`/campaigns/${address}`}> 
                                <a>View Campaign</a>
                              </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    // react expects some jsx with every class component
    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>

                    <Link route="/campaigns/new">
                        <a>
                            <Button floated="right" content='Create Campaign' icon='add' primary />
                        </a>
                    </Link>
                    
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;