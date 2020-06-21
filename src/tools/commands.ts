const KEY_REGEX = /\*\[(\.\w+)\]/i;
const ARGS_REGEX = /\*\[\.\w+\]\[([\w\s]+)\]/i;

export function getMessageKey(key: string, ...params: Array<string>) {
	return `*[${key}]${params.length ? `[${params.join(' ')}]` : ''}*`;
}

export function getKeyFromMessage(messageContent: string) {
	const result = KEY_REGEX.exec(messageContent);

	if (result && result[1]) {
		return result[1];
	}

	return null;
}

export function getArgsFromMessage(messageContent: string) {
	const result = ARGS_REGEX.exec(messageContent);

	if (result && result[1]) {
		return result[1].split(' ');
	}

	return null;
}
