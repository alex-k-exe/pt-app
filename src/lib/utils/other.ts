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

export const validEmail = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;
// require passwords to have one uppercase letter, one digit, and one special character
export const validPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;
export const validSignupToken = /^[a-zA-Z0-9]{6}$/;
