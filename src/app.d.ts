declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface Platform {
			env: {
				DB: D1Database;
			};
		}
	}

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
		};
		type DatabaseSessionAttributes = object;
	}
}

export {};
