import { existsSync, mkdirSync, copyFileSync } from 'fs';
import * as path from 'path';
import env from '../../../env';
import logger from '../../../logger';
import fse from 'fs-extra';

const migrationPath = path.resolve(env.EXTENSIONS_PATH, 'migrations');

if (!existsSync(migrationPath)) {
	mkdirSync(migrationPath);
}

function padNumberWithOneZero(number: number) {
	return number.toString().padStart(2, '0');
}

function formatYYYYMMDD(date: Date): string {
	return `${padNumberWithOneZero(date.getUTCFullYear())}${padNumberWithOneZero(
		date.getUTCMonth() + 1
	)}${padNumberWithOneZero(date.getUTCDate())}`;
}

async function generateMigrationFileName(migrationName: string) {
	const migrationPrefix = formatYYYYMMDD(new Date(Date.now()));

	let currentDaysMigrationFiles = await fse.readdir(migrationPath);

	currentDaysMigrationFiles = currentDaysMigrationFiles.filter((file: string) => {
		return new RegExp(`^${migrationPrefix}[A-Z]-[^.]+\\.js$`, 'i').test(file);
	});

	let nextCharVersion = 'A';
	if (currentDaysMigrationFiles.length > 0) {
		const latestMigrationFilePrefix = currentDaysMigrationFiles.reverse()[0].split('-', 1)[0];
		nextCharVersion = String.fromCharCode(
			latestMigrationFilePrefix.charCodeAt(latestMigrationFilePrefix.length - 1) + 1
		);
	}

	return `${migrationPrefix}${nextCharVersion}-${migrationName.replace('_', '-')}.js`;
}

export default async function start(migrationName: string) {
	const migrationFileName = await generateMigrationFileName(migrationName);
	copyFileSync(
		path.resolve(path.dirname(__dirname), 'templates/migration.js'),
		`${migrationPath}/${migrationFileName}`
	);
	logger.info(`Migration file generated: ${migrationFileName}`);
}