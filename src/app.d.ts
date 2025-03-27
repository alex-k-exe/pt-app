import { initLucia } from '$lib/server/lucia';
import { type ObjectValues, type userTypes } from '$lib/utils/types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Session, User } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			db: DrizzleD1Database;
			user: User | null;
			userType: ObjectValues | null;
			session: Session | null;
			lucia: ReturnType;
		}
	}
}

export {};
