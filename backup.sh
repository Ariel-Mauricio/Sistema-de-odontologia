#!/bin/bash

# Database Backup Script
BACKUP_DIR="/var/backups/clinicadental"
DB_NAME="odontologia"
DB_USER="odonto_user"
DB_PASSWORD="secure_password"
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_backup_$BACKUP_DATE.tar.gz \
    /var/www/clinicadental/backend/storage \
    /var/www/clinicadental/frontend/dist

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DATE"
