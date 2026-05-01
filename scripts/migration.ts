import { execSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const command = process.argv[2];
const nameArg = process.argv.find((arg) => arg.startsWith('--name='));
const name = nameArg ? nameArg.split('=')[1] : 'manual';

const migrationsDir = join(process.cwd(), 'src/infra/database/migrations');
const migrationPath = `./src/infra/database/migrations/${name}`;
const dataSourcePath = `./src/infra/database/data-source.ts`;

try {
  // 1. Run standard TypeORM CLI
  if (command === 'create') {
    console.log(`🛠  Creating empty migration: ${name}...`);
    execSync(`pnpm typeorm migration:create ${migrationPath}`, {
      stdio: 'inherit',
    });
  } else if (command === 'generate') {
    console.log(`⚙️  Generating migration based on schema changes: ${name}...`);
    execSync(
      `pnpm typeorm migration:generate -d ${dataSourcePath} ${migrationPath}`,
      {
        stdio: 'inherit',
      },
    );
  } else {
    console.error('❌ Unknown command. Use "create" or "generate".');
    process.exit(1);
  }

  // 2. Find the most recently created migration file
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.ts'));
  if (files.length === 0) process.exit(0);

  files.sort((a, b) => {
    return (
      statSync(join(migrationsDir, b)).mtimeMs -
      statSync(join(migrationsDir, a)).mtimeMs
    );
  });

  const latestFile = join(migrationsDir, files[0]);
  let content = readFileSync(latestFile, 'utf-8');

  // 3. Find the migration class name and inject/update the name property
  const classRegex =
    /export class ([A-Za-z0-9_]+) implements MigrationInterface {/;
  const match = content.match(classRegex);

  if (match) {
    const className = match[1];

    if (content.includes("name = '")) {
      // If it was 'generate', TypeORM already added name = '...', so we reformat it
      content = content.replace(
        /name = '[^']+'/,
        `public name = "${className}";`,
      );
    } else {
      // If it was 'create', the template is empty, so we inject the property
      content = content.replace(
        classRegex,
        `export class ${className} implements MigrationInterface {\n    public name = "${className}";`,
      );
    }

    writeFileSync(latestFile, content);
    console.log(`✨ Injected formatted name property into: ${files[0]}`);
  }
} catch (error) {
  console.error('❌ Error during migration processing:', error);
  process.exit(1);
}
