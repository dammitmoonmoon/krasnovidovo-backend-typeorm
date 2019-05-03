import path from "path";

const FILE_TYPE_REGEXP = /jpeg|jpg|png|bmp/;
const TARGET_FOLDER = '/upload';
const PATH = path.join(__dirname, TARGET_FOLDER);
const HOST = 'http://localhost:4000';

export {
    FILE_TYPE_REGEXP,
    TARGET_FOLDER,
    PATH,
    HOST,
};
