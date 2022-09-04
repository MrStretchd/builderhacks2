const FlakeId = require('flake-idgen');
const intformat = require('biguint-format');
const extend = require('util')._extend;
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 80 });
const flakeIdGen = new FlakeId();

const games = {};

wss.on('connection', function connection(ws) {
	let player = null;
	let game_id = null;
	ws.on('message', async function incoming(message) {
		if (!message) return;
		message = JSON.parse(message);

		if (message.action == 'start' && !message.game_id) {
			player = 1;
			game_id = intformat(flakeIdGen.next());
			games[game_id] = { board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], scores: {
				1: 0,
				2: 0,
			}, turn: 1, sockets:{ 1:null, 2:null }, players: { 1:true, 2:false } };

			newGameData = extend({}, games[game_id]);
			newGameData.sockets = {};
			const response = { action:'start', game_id:game_id, player:player, gameData: newGameData };
			games[game_id].sockets[player] = ws;
			ws.send(JSON.stringify(response));
		}
		else if (message.action == 'start') {
			if (!games[message.game_id]) {
				const response = { action:'error', error: 'invalid_game_id' };
				ws.send(JSON.stringify(response));
			}
			else {
				game_id = message.game_id;
				player = 2;
				games[game_id].players[player] = true;
				newGameData = extend({}, games[game_id]);
				newGameData.sockets = {};
				const response = { action:'start', game_id:game_id, player:player, gameData: newGameData };
				games[game_id].sockets[player] = ws;


				// Send gamedata update to the host
				newGameData = extend({}, games[game_id]);
				newGameData.sockets = {};
				message = { action:'gameData', gameData: newGameData };
				games[game_id].sockets[1].send(JSON.stringify(message));
				ws.send(JSON.stringify(response));
			}
		}

		if (message.action == 'play') {
			if (games[game_id].turn == player) {
				if (player == 1) {
					games[game_id].turn = 2;
				}
				else {
					games[game_id].turn = 1;
				}

			}
			else {
				return;
			}

			row = message.loc.row;
			column = message.loc.column;
			// If empty add player's move
			if (games[game_id].board[row][column] == 0) {
				games[game_id].board[row][column] = player;
			}

			if (userHas3InRow(games[game_id].board, player)) {
				games[game_id].board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
				games[game_id].scores[player] += 1;
			}
			if (isBoardFull(games[game_id].board)) {
				games[game_id].board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
			}

			newGameData = extend({}, games[game_id]);
			newGameData.sockets = {};
			message = { action:'gameData', gameData: newGameData };
			games[game_id].sockets[1].send(JSON.stringify(message));
			games[game_id].sockets[2].send(JSON.stringify(message));

		}

	});
	const last_game_data = null;
});

wss.on('error', console.log);


function userHas3InRow(board, user) {

	for (let i = 0; i < 3; i++) {
		if (board[0][i] == user && board[1][i] == user && board[2][i] == user) {
			return true;
		}
	}

	// Vertical rows
	for (let i = 0; i < 3; i++) {
		if (board[i][0] == user && board[i][1] == user && board[i][2] == user) {
			return true;
		}
	}

	// Diagonals
	if (board[0][0] == user && board[1][1] == user && board[2][2] == user) {
		return true;
	}
	if (board[1][0] == user && board[1][1] == user && board[0][2] == user) {
		return true;
	}

	return false;

}


function isBoardFull(board) {
	let rowsFull = 0;
	for (let i = 0; i < 3; i++) {
		if (!board[i].includes(0)) {
			rowsFull += 1;
		}
	}

	if (rowsFull == 3) {
		return true;
	}
}