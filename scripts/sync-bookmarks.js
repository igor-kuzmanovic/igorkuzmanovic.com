const { promises: fs } = require('fs');
const crypto = require('crypto');

const BOOKMARKS_INPUT =
  '/mnt/c/Users/Evervess/AppData/Local/Google/Chrome/User Data/Profile 1/Bookmarks';
const BOOKMARKS_OUTPUT = './public/bookmarks.json';

syncBookmarks().then(() => console.log(`Synced ${BOOKMARKS_OUTPUT}`));

async function syncBookmarks() {
  const inputFile = await tryReadFile(BOOKMARKS_INPUT);
  if (!inputFile) return;
  const inputData = JSON.parse(inputFile);
  if (!inputData) return;
  const inputBookmarks = getBookmarks(inputData);
  if (!inputBookmarks) return;
  const inputBookmarksSerialized = JSON.stringify(inputBookmarks);
  const outputFile = await tryReadFile(BOOKMARKS_OUTPUT);
  if (outputFile) {
    const inputBookmarksChecksum = generateChecksum(inputBookmarksSerialized);
    const outputBookmarksChecksum = generateChecksum(outputFile);
    if (inputBookmarksChecksum === outputBookmarksChecksum) return;
  }
  await fs.writeFile(BOOKMARKS_OUTPUT, inputBookmarksSerialized);
}

async function tryReadFile(path) {
  try {
    return await fs.readFile(path);
  } catch (_) {
    return null;
  }
}

function getBookmarks(data) {
  return data?.roots.bookmark_bar.children.find(
    (child) => child.name === 'Tech'
  ).children;
}

function generateChecksum(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}
