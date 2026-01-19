import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔍 Checking for database backups...\n');

  const projectRoot = process.cwd();
  
  // Check for JSON backups (created by backup-database.js)
  console.log('📦 Checking for JSON backups...');
  const jsonBackups = fs.readdirSync(projectRoot)
    .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
    .map(f => {
      const fullPath = path.join(projectRoot, f);
      const stats = fs.statSync(fullPath);
      return {
        name: f,
        path: fullPath,
        size: stats.size,
        modified: stats.mtime,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.modified.getTime() - a.modified.getTime());

  if (jsonBackups.length === 0) {
    console.log('   ❌ No JSON backup files found in project root\n');
  } else {
    console.log(`   ✅ Found ${jsonBackups.length} JSON backup file(s):\n`);
    jsonBackups.forEach(backup => {
      console.log(`   📄 ${backup.name}`);
      console.log(`      Size: ${backup.sizeMB} MB`);
      console.log(`      Modified: ${backup.modified.toLocaleString()}`);
      console.log('');
    });
  }

  // Check for SQLite backups
  console.log('💾 Checking for SQLite backups...');
  const backupsDir = path.join(projectRoot, 'prisma', 'backups');
  if (fs.existsSync(backupsDir)) {
    const sqliteBackups = fs.readdirSync(backupsDir)
      .filter(f => f.endsWith('.db') || f.endsWith('.db.bak') || f.endsWith('.sqlite'))
      .map(f => {
        const fullPath = path.join(backupsDir, f);
        const stats = fs.statSync(fullPath);
        return {
          name: f,
          path: fullPath,
          size: stats.size,
          modified: stats.mtime,
          sizeMB: (stats.size / 1024 / 1024).toFixed(2)
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());

    if (sqliteBackups.length === 0) {
      console.log('   ❌ No SQLite backup files found\n');
    } else {
      console.log(`   ✅ Found ${sqliteBackups.length} SQLite backup file(s):\n`);
      sqliteBackups.forEach(backup => {
        console.log(`   📄 ${backup.name}`);
        console.log(`      Size: ${backup.sizeMB} MB`);
        console.log(`      Modified: ${backup.modified.toLocaleString()}`);
        console.log('');
      });
      console.log('   ⚠️  Note: You are using PostgreSQL, not SQLite. These backups may be outdated.\n');
    }
  } else {
    console.log('   ❌ Backups directory not found\n');
  }

  // Check for SQL dumps
  console.log('🗄️  Checking for SQL dump files...');
  const sqlDumps = fs.readdirSync(projectRoot)
    .filter(f => f.startsWith('backup-') && f.endsWith('.sql'))
    .map(f => {
      const fullPath = path.join(projectRoot, f);
      const stats = fs.statSync(fullPath);
      return {
        name: f,
        path: fullPath,
        size: stats.size,
        modified: stats.mtime,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.modified.getTime() - a.modified.getTime());

  if (sqlDumps.length === 0) {
    console.log('   ❌ No SQL dump files found\n');
  } else {
    console.log(`   ✅ Found ${sqlDumps.length} SQL dump file(s):\n`);
    sqlDumps.forEach(dump => {
      console.log(`   📄 ${dump.name}`);
      console.log(`      Size: ${dump.sizeMB} MB`);
      console.log(`      Modified: ${dump.modified.toLocaleString()}`);
      console.log('');
    });
  }

  // Summary
  const totalBackups = jsonBackups.length + sqlDumps.length;
  
  console.log('\n📋 Summary:');
  console.log(`   JSON backups: ${jsonBackups.length}`);
  console.log(`   SQL dumps: ${sqlDumps.length}`);
  console.log(`   Total: ${totalBackups}`);

  if (totalBackups === 0) {
    console.log('\n❌ No backups found in the project directory.');
    console.log('   If you have backups elsewhere (external drive, cloud, etc.), check those locations.');
    console.log('   You may also want to check:');
    console.log('   - Vercel/production environment backups (if deployed)');
    console.log('   - Database provider backups (Neon, Supabase, etc.)');
    console.log('   - Git history (though .gitignore excludes backups)');
  } else if (jsonBackups.length > 0) {
    console.log('\n✅ Found JSON backups! These can be restored using a restore script.');
    console.log(`   Most recent: ${jsonBackups[0].name}`);
  }

  // If we found JSON backups, offer to check one for verb quiz submissions
  if (jsonBackups.length > 0) {
    console.log('\n💡 Tip: I can check the most recent backup for verb quiz submissions.');
    console.log('   Just ask me to check the backup file!');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
