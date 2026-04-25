const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');
const packageJson = require(path.join(projectRoot, 'package.json'));
const version = packageJson.version;

const filesToInclude = [
    'background.js',
    'content.js',
    'icon.png',
    'popup.html',
    'popup.js',
    'styles.css',
    'content/',
    'popup/'
];

const targets = [
    {
        browser: 'chrome',
        manifest: 'manifest.json'
    },
    {
        browser: 'firefox',
        manifest: 'manifest-firefox.json'
    },
    {
        browser: 'edge',
        manifest: 'manifest.json'
    }
];

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

async function createZip(target) {
    const zipFileName = `email-blurrer-${target.browser}-v${version}.zip`;
    const output = fs.createWriteStream(path.join(distDir, zipFileName));
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log(`Successfully created ${zipFileName}`);
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    // Add files and directories from src
    filesToInclude.forEach(fileOrDir => {
        const fullPath = path.join(srcDir, fileOrDir);
        if (fs.existsSync(fullPath)) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                archive.directory(fullPath, path.basename(fileOrDir));
            } else {
                archive.file(fullPath, { name: path.basename(fileOrDir) });
            }
        }
    });
    
    // Add manifest
    const manifestPath = path.join(srcDir, target.manifest);
    archive.file(manifestPath, { name: 'manifest.json' });

    await archive.finalize();
}

async function build() {
    for (const target of targets) {
        await createZip(target);
    }
}

build().catch(console.error);
