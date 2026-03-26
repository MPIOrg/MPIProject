-- Inserare categorii de tip EXPENSE
INSERT IGNORE INTO categories (id, name, type) VALUES (1, 'Food & Groceries', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (2, 'Housing & Rent', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (3, 'Transport', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (4, 'Dining Out', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (5, 'Entertainment', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (6, 'Shopping', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (7, 'Health', 'EXPENSE');
INSERT IGNORE INTO categories (id, name, type) VALUES (8, 'Education', 'EXPENSE');

-- Inserare categorii de tip INCOME
INSERT IGNORE INTO categories (id, name, type) VALUES (9, 'Salary', 'INCOME');
INSERT IGNORE INTO categories (id, name, type) VALUES (10, 'Freelancing', 'INCOME');
INSERT IGNORE INTO categories (id, name, type) VALUES (11, 'Gifts', 'INCOME');
INSERT IGNORE INTO categories (id, name, type) VALUES (12, 'Investments', 'INCOME');