// src/database/migrations/001-initial-setup.js
// Note: You would use a dedicated migration tool (like 'migrate-mongo') here. 
// This is a conceptual placeholder.

module.exports = {
    async up(db, client) {
        // 1. User Index (ensure email is unique)
        await db.collection('users').createIndex({ email: 1 }, { unique: true });

        // 2. Startup Index (for faster lookup and filtering)
        await db.collection('startups').createIndex({ name: 1, sector: 1 });

        // 3. Score Index (for efficient score history lookup)
        await db.collection('scores').createIndex({ startup_id: 1, scored_at: -1 });

        console.log('Migration 001: Initial indexes created successfully.');
    },

    async down(db, client) {
        // Rollback changes
        await db.collection('users').dropIndex('email_1');
        await db.collection('startups').dropIndex('name_1_sector_1');
        await db.collection('scores').dropIndex('startup_id_1_scored_at_-1');

        console.log('Migration 001: Indexes dropped successfully.');
    }
};