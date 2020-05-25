import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import web3 from '../utils/web3';
import GameFactory from '../utils/GambleFactory';
import { Link } from '../routes';
import moment from 'moment';
// import styles from './layout.module.css';

class MatchCard extends Component {
	state = { isLoading: false };
	onSubmit = async (e) => {
		e.preventDefault();
		const accounts = await web3.eth.getAccounts();
		await GameFactory.methods.createGamble(this.props.match.id).send({
			from: accounts[0],
		});
	};
	render() {
		const { match } = this.props;
		return (
			<Card fluid style={{ margin: 5, cursor: 'pointer' }}>
				<Card.Content>
					<Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
						{match.name}
						{this.props.admin ? (
							<Button onClick={this.onSubmit} primary>
								Create Betting
							</Button>
						) : (
							<Link route={`/matches/${this.props.address}`}>
								<a className="item">Betting Info</a>
							</Link>
						)}
					</Card.Header>

					<Card.Meta>{moment(match.begin_at).format('MMMM Do YYYY, h:mm:ss a')}</Card.Meta>
					<Card.Description>Number of Games: {match.number_of_games}</Card.Description>
				</Card.Content>
			</Card>
		);
	}
}

export default MatchCard;
