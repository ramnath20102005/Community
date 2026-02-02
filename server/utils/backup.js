const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const BACKUP_DIR = path.join(__dirname, '../backups');

/**
 * Perform a full database backup to JSON files
 */
const performBackup = async () => {
    console.log('📦 Starting Automatic Database Backup...');

    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const todayBackupDir = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(todayBackupDir);

    try {
        const collections = Object.keys(mongoose.connection.collections);
        
        for (const collectionName of collections) {
            const data = await mongoose.connection.collection(collectionName).find({}).toArray();
            const filePath = path.join(todayBackupDir, `${collectionName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Backed up collection: ${collectionName}`);
        }

        console.log(`✨ Backup completed successfully at ${todayBackupDir}`);
        
        // Cleanup old backups (keep last 7 days)
        cleanupOldBackups();
        
    } catch (err) {
        console.error('❌ Backup Failed:', err);
    }
};

/**
 * Delete backups older than 7 days
 */
const cleanupOldBackups = () => {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    files.forEach(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtimeMs > SEVEN_DAYS_MS) {
            console.log(`🗑️ Removing old backup: ${file}`);
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    });
};

/**
 * Schedule the backup task
 * Default: Every day at 2:00 AM
 */
const initBackupScheduler = () => {
    // Schedule: Minute Hour DayOfMonth Month DayOfWeek
    // '0 2 * * *' = 2:00 AM every day
    cron.schedule('0 2 * * *', () => {
        performBackup();
    });

    console.log('⏰ Database Backup Scheduler Initialized (Daily at 2:00 AM)');
    
    // Optional: Run one backup on startup to ensure it works
    // performBackup();
};

module.exports = {
    performBackup,
    initBackupScheduler
};
