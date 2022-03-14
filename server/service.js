//file system import
import { createReadStream } from 'fs';
import fsPromises from 'fs/promises';
import { extname } from 'path';

import { join } from 'path';
import config from './config.js';

export class Service {
    createFileStream(filename) {
        return createReadStream(filename);
    }

    async getFileInfo(file) {
        // file = home/index.html
        const { publicDir } = config.dir;
        console.log(publicDir)
        const fullFilePath = join(publicDir, file);

        // valida se existe, se nao existe estoura erro!!
        await fsPromises.access(fullFilePath);
        const fileType = extname(fullFilePath);

        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file) {
        const { name, type } = await this.getFileInfo(file);
        return {
            stream: this.createFileStream(name),
            type
        }
    }
}