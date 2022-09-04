const express = require('express');
const bodyparser = require('body-parser');
const FlakeId = require('flake-idgen');
const intformat = require('biguint-format');
const { ChannelType } = require('@onehop/js');
const { hop } = require('./hop');

const app = express();
const flakeIdGen = new FlakeId();

app.set('json spaces', 1);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/create', async (req, res) => {
	const id = intformat(flakeIdGen.next(), 'dec');
	const channel = await hop.channels.create(
		ChannelType.UNPROTECTED,
		'game-id',
		{
			// Initial Channel state object
			state: {
				id: id,
				opp1: 2,
				opp2: 3,
			},
		},
	);
});

app.listen(80, () => {
	console.log('Server running on port 3000');
});