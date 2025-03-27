/**
 * Convert a number to its representation as an upper-case letter
 * @param n Number, converted to absolute value and floored
 * @returns Letter in the English alphabet that represents n. If n < 1 returns 'A', if n > 26 returns 'Z'
 */
export function numberToLetter(n: number) {
	n = Math.floor(Math.abs(n));
	if (n < 1) return 'A';
	if (n > 26) return 'Z';
	// 64 is the ASCII value of 'A' minus 1
	return String.fromCharCode(n + 64);
}

export function generateSignupToken() {
	const min = 100000;
	const max = 999999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUniqueString(length: number = 12): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let uniqueString = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		uniqueString += characters[randomIndex];
	}

	return uniqueString;
}
