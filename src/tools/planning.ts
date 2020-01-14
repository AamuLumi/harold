import * as Discord from 'discord.js';
import * as moment from 'moment';

import 'moment/locale/fr';

const NB_DAYS_IN_WEEK = 7;

export const DAY_EMOJIS = ['🇱', '🇲', 'Ⓜ️', '🇯', '🇻', '🇸', '🇩'];

export function generateWeekPlanningMessage(message?: Discord.Message) {
	const weekBeginning = moment().startOf('week');
	const weekEnd = moment().endOf('week');
	const currentDate = moment(weekBeginning);

	let content = `**Disponibilités pour la semaine du ${weekBeginning.format(
		'L',
	)} au ${weekEnd.format('L')}**\n`;

	for (let i = 0; i < NB_DAYS_IN_WEEK; i++) {
		content += `- ${currentDate.format('dddd LL')} : `;

		if (message) {
			const dayReaction = message.reactions.find(
				(reaction) => reaction.emoji.name === DAY_EMOJIS[i],
			);
			const nbReactions = dayReaction.count - 1;

			if (nbReactions > 0) {
				content += `*${nbReactions} personne${
					nbReactions > 1 ? 's' : ''
				}* (${dayReaction.users.reduce(
					(acc, user) => (!user.bot ? `${acc} ${user.username}` : acc),
					'',
				)} )`;
			} else {
				content += `*0 personne*`;
			}
		} else {
			content += `*0 personne*`;
		}

		content += '\n';

		currentDate.add(1, 'day');
	}

	return content;
}
