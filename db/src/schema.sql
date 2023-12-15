-- import { integer,
-- sqliteTable,
-- text }
-- from 'drizzle-orm/sqlite-core';
-- export const children = sqliteTable(
--     'children',
--     { id: integer('id').primaryKey(),
--     name: text('name').notNull(),
--     presentWeight: real('presentWeight').notNull().default(0) }
-- );
DROP TABLE IF EXISTS children;
CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY,
    childName TEXT,
    totalPresentWeight real
);
INSERT INTO children (id, childName, totalPresentWeight)
VALUES (1, 'Alfreds Futterkiste', 2),
    (4, 'Around the Horn', 2.5),
    (11, 'Bs Beverages', -3),
    (13, 'Bs Beverages', 9.22);