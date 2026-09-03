#!/usr/bin/env bun
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function resolveVersion() {
	const arg = process.argv.find((a) => a.startsWith("--version="));
	if (arg) {
		const value = arg.slice("--version=".length).trim();
		if (value) return value;
	}
	try {
		const tag = execFileSync("git", ["describe", "--tags", "--abbrev=0"], {
			cwd: ROOT,
			encoding: "utf8",
		}).trim();
		if (tag) return tag.replace(/^v/, "");
	} catch {
		// no tags yet
	}
	return null;
}

const version = resolveVersion();
if (!version) {
	console.error("No version found. Pass --version=x.y.z or create a git tag.");
	process.exit(1);
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
	console.error(`Invalid version: ${version}`);
	process.exit(1);
}

const changed = [];

// package.json — update only the "version" value, preserving formatting.
const pkgPath = `${ROOT}package.json`;
const pkgText = readFileSync(pkgPath, "utf8");
const pkgNext = pkgText.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
if (pkgNext !== pkgText) {
	writeFileSync(pkgPath, pkgNext);
	changed.push("package.json");
}

// CHANGELOG.md — promote the [Unreleased] section to the new version.
const changelogPath = `${ROOT}CHANGELOG.md`;
const changelogText = readFileSync(changelogPath, "utf8");
const today = new Date().toISOString().slice(0, 10);
const changelogNext = changelogText.replace(
	"## [Unreleased]",
	`## [${version}] - ${today}`,
);
if (changelogNext !== changelogText) {
	writeFileSync(changelogPath, changelogNext);
	changed.push("CHANGELOG.md");
} else {
	console.warn("No `## [Unreleased]` heading found in CHANGELOG.md; skipped.");
}

console.log(
	changed.length
		? `Version bumped to ${version} in ${changed.join(", ")}.`
		: `Nothing to change for version ${version}.`,
);
