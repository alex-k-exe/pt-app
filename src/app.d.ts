import { initLucia } from '$lib/server/lucia';
import { type ObjectValues, type userTypes } from '$lib/utils/types';
import type Database from 'better-sqlite3';
import { Session, User } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			db: DrizzleD1Database;
			sqliteDB: Database;
			user: User | null;
			userType: ObjectValues | null;
			session: Session | null;
			lucia: ReturnType;
		}
	}
}

export {};
