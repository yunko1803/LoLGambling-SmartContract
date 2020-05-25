import React, { Component } from 'react';
import moment from 'moment';
import Layout from '../../components/Layout';
import { Grid, Image, Form, Input, Button, Message } from 'semantic-ui-react';
import Gamble from '../../utils/Gamble';
import axios from 'axios';
import Loading from '../../components/Loading';
import web3 from '../../utils/web3';
import { Link, Router } from '../../routes';
var BN = web3.utils.BN;

export default class MatchBetting extends Component {
	state = {
		game: null,
		isLoading: true,
		teamOne: '',
		teamTwo: '',
		bettingOne: '',
		bettingTwo: '',
		error: { one: false, two: false, msg: '' },
		bettingLoading: { one: false, two: false },
	};
	static async getInitialProps(props) {
		const { address } = props.query;
		console.log(address);
		return { address: address };
	}
	componentDidMount = async () => {
		const gamble = Gamble(this.props.address);
		let id = await gamble.methods.gameId().call();
		const { data } = await axios.get(`/api/test?filter[id]=${id}`);
		const teamOne = await gamble.methods.totalBetsOne().call();
		const teamTwo = await gamble.methods.totalBetsTwo().call();

		this.setState({ game: data[0], isLoading: false, teamOne, teamTwo });
	};
	onSubmit = async (e, team) => {
		const { bettingOne, bettingTwo } = this.state;
		e.preventDefault();
		this.setState((prev) => {
			let bettingLoading = Object.assign({}, prev.bettingLoading);
			let error = Object.assign({}, prev.error);
			error['msg'] = '';
			error['one'] = false;
			error['two'] = false;
			bettingLoading[team] = true;
			return { bettingLoading, error };
		});

		try {
			const accounts = await web3.eth.getAccounts();
			const gamble = Gamble(this.props.address);

			if (team == 'one') {
				console.log(gamble);
				await gamble.methods.bet(1).send({
					from: accounts[0],
					value: web3.utils.toWei(bettingOne, 'ether'),
				});
			} else {
				console.log(5);
				await gamble.methods.bet(2).send({
					from: accounts[0],
					value: web3.utils.toWei(bettingTwo, 'ether'),
				});
			}
			console.log(6);
			Router.replaceRoute(`/matches/${this.props.address}`);
		} catch (e) {
			this.setState((prev) => {
				let error = Object.assign({}, prev.error);
				error[team] = true;
				error['msg'] = e.message;
				return { error };
			});
		}
		this.setState((prev) => {
			let bettingLoading = Object.assign({}, prev.bettingLoading);
			bettingLoading[team] = false;
			return { bettingLoading };
		});
	};
	render() {
		const { game, isLoading, teamOne, teamTwo, bettingOne, bettingTwo, bettingLoading, error } = this.state;
		// console.log(game);
		// console.log(game.opponents);
		// console.log(game.opponents[1].image_url);
		return (
			<Layout>
				<Link route={'/'}>
					<a>Back</a>
				</Link>
				{isLoading ? (
					<Loading></Loading>
				) : (
					<Grid celled="internally" style={{ marginTop: 50 }}>
						<Grid.Row>
							<Grid.Column width={4}>
								<Image src={game.opponents[0].opponent.image_url} />
							</Grid.Column>
							<Grid.Column width={6} textAlign="center">
								<h4> Match Begins</h4>
								<h3 style={{ marginTop: 10 }}>
									{moment(game.begin_at).format('MMMM Do YYYY, h:mm:ss a')}
								</h3>
								<h1 style={{ fontSize: '4em', marginTop: 30 }}>VS</h1>
							</Grid.Column>
							<Grid.Column width={4}>
								<Image src={game.opponents[1].opponent.image_url} />
							</Grid.Column>
						</Grid.Row>

						<Grid.Row stretched>
							<Grid.Column width={4} textAlign="center" verticalAlign="middle">
								<h2>{web3.utils.fromWei(teamOne, 'ether')} ETH</h2>
							</Grid.Column>
							<Grid.Column width={6} textAlign="center" verticalAlign="middle">
								<h2>Current Total Betting</h2>
								<h3>Minimum Bet: 0.0001 ETH</h3>
							</Grid.Column>
							<Grid.Column width={4} textAlign="center">
								<h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									{web3.utils.fromWei(teamTwo, 'ether')} ETH
								</h2>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row stretched>
							<Grid.Column width={4} textAlign="center">
								<Form onSubmit={(e) => this.onSubmit(e, 'one')} error={error['one']}>
									<Form.Field>
										<Input
											size="mini"
											label="eth"
											labelPosition="right"
											value={bettingOne}
											onChange={(e) => this.setState({ bettingOne: e.target.value })}
										/>
									</Form.Field>
									<Message error header="Oops!" content={error['msg']} />
									<Button primary loading={bettingLoading['one']}>
										bet
									</Button>
								</Form>
							</Grid.Column>
							<Grid.Column width={6} textAlign="center">
								<h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Bet</h2>
							</Grid.Column>
							<Grid.Column width={4} textAlign="center">
								<Form onSubmit={(e) => this.onSubmit(e, 'two')} error={error['two']}>
									<Form.Field>
										<Input
											size="mini"
											label="eth"
											labelPosition="right"
											value={bettingTwo}
											onChange={(e) => this.setState({ bettingTwo: e.target.value })}
										/>
									</Form.Field>
									<Message error header="Oops!" content={error['msg']} />
									<Button primary loading={bettingLoading['two']}>
										bet
									</Button>
								</Form>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				)}
			</Layout>
		);
	}
}
