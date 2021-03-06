import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign'; // get contract 
import web3 from '../ethereum/web3';
import { Router } from '../routes';


class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    };

    onSubmit = async (event) => {
        event.preventDefault(); // keep form from submitting itself

        this.setState({ loading: true, errorMessage: '' });

        const campaign = Campaign(this.props.address); // contract instance pointing at correct address

        try {
            // get list of accounts
            const accounts = await web3.eth.getAccounts();
            
            // call contribute function from contract
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, "ether")
            });

            
            Router.replaceRoute(`/campaigns/${this.props.address}`);  // rerun after contribution so values on cards update
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, value: '' });
    }

    render() {
        // we don't put () after onSubmit because we don't want it to be called on render
        // it will only be called when someone clicks submit
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        value={this.state.value} 
                        onChange={event => this.setState({ value: event.target.value})}
                        label="ether" 
                        labelPosition="right"/>
                </Form.Field>

                <Message error header="Woops" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Contribute</Button>
            </Form>
        )
    }
}

export default ContributeForm;