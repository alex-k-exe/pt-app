declare namespace App {
	interface Locals {
		auth: import('lucia').AuthRequest;
	}

	interface Session {}

	interface Stuff {}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
		};
		type DatabaseSessionAttributes = object;
	}
}

export {};
