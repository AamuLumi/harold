import * as Discord from 'discord.js';
import * as moment from 'moment';

import Logger from '../tools/logger';
import { DAY_EMOJIS, generateWeekPlanningMessage } from '../tools/planning';

const createdMessageIds: Array<string> = [];

async function updatePlanning(reaction: Discord.MessageReaction, user: Discord.User) {
	if (
		!user.bot &&
		DAY_EMOJIS.indexOf(reaction.emoji.name) !== -1 &&
		createdMessageIds.indexOf(reaction.message.id) !== -1
	) {
		await reaction.message.edit(generateWeekPlanningMessage(reaction.message));
	}
}

export default {
	key: '.planning',
	exec: async (message: Discord.Message) => {
		const newMessage = await message.channel.send(generateWeekPlanningMessage());

		if (!Array.isArray(newMessage)) {
			createdMessageIds.push(newMessage.id);

			await DAY_EMOJIS.reduce((promise, emoji) => {
				return promise.then(() => newMessage.react(emoji));
			}, Promise.resolve());

			const timeBeforeEndOfWeek =
				moment()
					.endOf('week')
					.valueOf() - moment().valueOf();

			setTimeout(() => {
				newMessage.clearReactions();

				const index = createdMessageIds.indexOf(newMessage.id);

				if (index !== -1) {
					createdMessageIds.splice(index, 1);
				}
			}, timeBeforeEndOfWeek);
		}

		await message.delete();
	},
	onMessageReactionAdd: updatePlanning,
	onMessageReactionRemove: updatePlanning,
};
