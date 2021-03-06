import React, { Component } from 'react';
import Head from 'next/head';
import contract from 'truffle-contract';
import Gamble from '../utils/Gamble';
import GambleFactory from '../utils/GambleFactory';
import web3 from '../utils/web3';
import axios from 'axios';
import Layout from '../components/Layout';
import MatchCard from '../components/MatchCard';
import { Card } from 'semantic-ui-react';
import Loading from '../components/Loading';
import { Menu } from 'semantic-ui-react';

// import Gamble from '../build/contracts/Gamble.json';

class Home extends Component {
	state = { amount: 0, data: null, search: '', activeItem: 'All', filteredData: null, admin: false };
	// static async getInitialProps(props) {
	// 	let accounts = await web3.eth.getAccounts();
	// 	let response;
	// 	try {
	// 		console.log('running');
	// 		response = await axios.get(serverUrl + `/lol/champions?${token}`);
	// 		console.log(response.data);
	// 	} catch (e) {}
	// 	return { accounts };
	// }
	componentDidMount = async () => {
		// const accounts = await web3.eth.getAccounts();
		const { data } = await axios.get('/api/test');
		const gambles = await GambleFactory.methods.getDeployedGambles().call();
		let gambleIDs = [];
		for (let i = 0; i < gambles.length; i++) {
			let gamble = Gamble(gambles[i]);
			let id = await gamble.methods.gameId().call();
			gambleIDs.push(id);
		}
		let index = 0;
		//gotta change this to hashmap

		let filteredData = data.filter((e, i) => {
			if (e.id == gambleIDs[index]) {
				index++;
				return true;
			}
		});
		console.log(filteredData);
		this.setState({ data: filteredData, filteredData, gambles, gambleIDs });
	};

	handleItemClick = (e, { name }) => {
		const { data } = this.state;
		let filteredData;
		switch (name) {
			case 'All':
				filteredData = data;
				break;
			case 'LCK':
				filteredData = data.filter((e) => e.league.name == 'LCK');
				break;
			case 'LPL':
				filteredData = data.filter((e) => e.league.name == 'LPL');
				break;
			case 'LEC':
				filteredData = data.filter((e) => e.league.name == 'LEC');
				break;
			case 'LCS':
				filteredData = data.filter((e) => e.league.name == 'LCS');
				break;
			case 'Mid-Season Cup':
				filteredData = data.filter((e) => e.league.name == 'Mid-Season Cup');
				break;
		}
		this.setState({ activeItem: name, filteredData });
	};

	renderMatches = () => {
		const { filteredData, gambles } = this.state;
		if (filteredData != undefined) {
			const matches = filteredData.map((match, i) => (
				<MatchCard key={i} match={match} admin={this.state.admin} address={gambles[i]} />
			));
			return matches;
		} else {
			return <Loading />;
		}
	};

	render() {
		const { activeItem, data } = this.state;
		return (
			<Layout>
				<div>
					<h3 style={{ textAlign: 'center' }}>Upcoming Matches</h3>
					<Menu>
						<Menu.Item name="All" active={activeItem === 'All'} onClick={this.handleItemClick}>
							All
						</Menu.Item>

						<Menu.Item name="LCK" active={activeItem === 'LCK'} onClick={this.handleItemClick}>
							LCK
						</Menu.Item>

						<Menu.Item name="LPL" active={activeItem === 'LPL'} onClick={this.handleItemClick}>
							LPL
						</Menu.Item>
						<Menu.Item name="LEC" active={activeItem === 'LEC'} onClick={this.handleItemClick}>
							LEC
						</Menu.Item>
						<Menu.Item name="LCS" active={activeItem === 'LCS'} onClick={this.handleItemClick}>
							LCS
						</Menu.Item>
						<Menu.Item
							name="Mid-Season Cup"
							active={activeItem === 'Mid-Season Cup'}
							onClick={this.handleItemClick}
						>
							Mid-Season Cup
						</Menu.Item>
					</Menu>
					<Card.Group style={{ marginTop: 20 }}>{this.renderMatches()}</Card.Group>
					{/* <input
						type="text"
						value={this.state.search}
						onChange={this.handleChange}
						onKeyDown={this.handlePressKey}
					/> */}
				</div>
			</Layout>
		);
	}
}

export default Home;
