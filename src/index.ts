import * as Discord from 'discord.js';
import * as http from 'http';
import readline from 'readline';

import PlanningCommand from './commands/planning';

import Logger from './tools/logger';

Logger.addLogger({
	...console,
	clearLine: () => readline.clearLine(process.stdout, 1),
	raw: (message) => process.stdout.write(message),
});

if (!process.env.DISCORD_TOKEN) {
	Logger.error('No DISCORD_TOKEN provided in env.');

	process.exit(-1);
}

const client = new Discord.Client();

const commands = [PlanningCommand];

client.on('ready', () => {
	Logger.info('Bot ready');
});

client.on('message', async (message) => {
	const command = commands.find((command) => message.content.startsWith(command.key));

	if (command) {
		command.exec(message);
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	commands.forEach((command) => {
		if (command.onMessageReactionAdd) {
			command.onMessageReactionAdd(reaction, user);
		}
	});
});

client.on('messageReactionRemove', async (reaction, user) => {
	commands.forEach((command) => {
		if (command.onMessageReactionRemove) {
			command.onMessageReactionRemove(reaction, user);
		}
	});
});

client.login(process.env.DISCORD_TOKEN);

// Create a fake server for the deployment
const server = http.createServer((request, response) => {
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end('Nothing here\n');
});

server.listen(process.env.PORT);
