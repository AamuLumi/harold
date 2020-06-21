import * as Discord from 'discord.js';
import * as moment from 'moment';

import { getMessageKey, getKeyFromMessage, getArgsFromMessage } from '../tools/commands';
import { DAY_EMOJIS, generateWeekPlanningMessage } from '../tools/planning';

const COMMAND_KEY = '.planning';

async function updatePlanning(reaction: Discord.MessageReaction, user: Discord.User) {
	if (
		!user.bot &&
		DAY_EMOJIS.indexOf(reaction.emoji.name) !== -1 &&
		getKeyFromMessage(reaction.message.content) === COMMAND_KEY
	) {
		const args = getArgsFromMessage(reaction.message.content);

		let weekNumber = moment().week();

		if (args && args[0] && !isNaN(parseInt(args[0]))) {
			weekNumber = parseInt(args[0]);
		}

		const planningMessage = await generateWeekPlanningMessage(reaction.message, weekNumber);

		await reaction.message.edit(
			`${getMessageKey(COMMAND_KEY, String(weekNumber))} - ${planningMessage}`,
		);
	}
}

export default {
	key: COMMAND_KEY,
	exec: async (message: Discord.Message) => {
		let weekNumber = moment().week();

		const args = message.content.split(' ');

		if (args[1] === 'next') {
			weekNumber++;
		} else if (!isNaN(parseInt(args[1]))) {
			weekNumber = parseInt(args[1]);
		}

		const planningMessage = await generateWeekPlanningMessage(null, weekNumber);

		const newMessage = await message.channel.send(
			`${getMessageKey(COMMAND_KEY, String(weekNumber))} - ${planningMessage}`,
		);

		if (!Array.isArray(newMessage)) {
			await DAY_EMOJIS.reduce((promise, emoji) => {
				return promise.then(() => newMessage.react(emoji));
			}, Promise.resolve());
		}

		await message.delete();
	},
	onMessageReactionAdd: updatePlanning,
	onMessageReactionRemove: updatePlanning,
};
