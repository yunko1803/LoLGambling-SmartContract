import axios from 'axios';
import qs from 'qs';

export default async (req, res) => {
	const query = { ...req.query, token: 'zRgaWABLL9NwQh8wk6gtkIXhZJOgvSEhL7f00qWAE3HGlXB8J2w' };

	// const result = [
	// 	...(
	// 		await axios.get(
	// 			`https://api.pandascore.co/lol/matches/upcoming?${qs.stringify({ ...query, per_page: 100, page: 0 })}`
	// 		)
	// 	).data,
	// 	...(
	// 		await axios.get(
	// 			`https://api.pandascore.co/lol/matches/upcoming?${qs.stringify({ ...query, per_page: 100, page: 1 })}`
	// 		)
	// 	).data,
	// 	...(
	// 		await axios.get(
	// 			`https://api.pandascore.co/lol/matches/upcoming?${qs.stringify({ ...query, per_page: 100, page: 2 })}`
	// 		)
	// 	).data,
	// 	...(
	// 		await axios.get(
	// 			`https://api.pandascore.co/lol/matches/upcoming?${qs.stringify({ ...query, per_page: 100, page: 3 })}`
	// 		)
	// 	).data,
	// ];
	const result = (
		await axios.get(
			`https://api.pandascore.co/lol/matches/upcoming?${qs.stringify({ ...query, per_page: 100, page: 0 })}`
		)
	).data;

	res.json(result);
};
