import { createCipheriv, createHash, randomBytes } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

type CliArgs = {
  input: string;
  outputDir: string;
  stamp: string;
};

function parseArgs(argv: string[]): CliArgs {
  const args = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args.set(key, value);
    index += 1;
  }

  const input = args.get("input");
  const outputDir = args.get("output-dir");
  const stamp = args.get("stamp");

  if (!input || !outputDir || !stamp) {
    throw new Error("Usage: --input <file> --output-dir <dir> --stamp <utc-stamp>");
  }

  return { input, outputDir, stamp };
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret, "utf8").digest();
}

function encryptAesGcm(plain: Buffer, secret: string): Buffer {
  const key = deriveKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]);
}

function parseDatabaseMetadata(urlValue: string | undefined) {
  if (!urlValue) {
    return null;
  }

  try {
    const parsed = new URL(urlValue);
    return {
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\/+/, ""),
    };
  } catch {
    return null;
  }
}

async function main() {
  const { input, outputDir, stamp } = parseArgs(process.argv.slice(2));
  const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;
  const createdAt = new Date().toISOString();
  const baseName = `backup-${stamp}.dump`;
  const manifestPath = path.join(outputDir, `backup-${stamp}.manifest.json`);

  if (!fs.existsSync(input)) {
    throw new Error(`Input dump file not found: ${input}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const dumpBuffer = fs.readFileSync(input);
  const finalName = encryptionKey ? `${baseName}.enc` : baseName;
  const finalBuffer = encryptionKey ? encryptAesGcm(dumpBuffer, encryptionKey) : dumpBuffer;
  const finalPath = path.join(outputDir, finalName);
  const checksum = sha256(finalBuffer);
  const checksumPath = `${finalPath}.sha256`;
  const database = parseDatabaseMetadata(process.env.BACKUP_DATABASE_URL);

  fs.writeFileSync(finalPath, finalBuffer);
  fs.writeFileSync(checksumPath, `${checksum}  ${path.basename(finalPath)}\n`, "utf8");

  const manifest = {
    createdAt,
    stamp,
    artifact: path.basename(finalPath),
    checksumFile: path.basename(checksumPath),
    checksumSha256: checksum,
    encrypted: Boolean(encryptionKey),
    bytes: finalBuffer.length,
    sourceBytes: dumpBuffer.length,
    database,
    note: "Restore-grade PostgreSQL dump packaged for off-platform storage.",
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Packaged backup artifact: ${finalPath}`);
  console.log(`Checksum file: ${checksumPath}`);
  console.log(`Manifest file: ${manifestPath}`);
}

main().catch((error) => {
  console.error("Failed to package PostgreSQL backup:", error);
  process.exit(1);
});
