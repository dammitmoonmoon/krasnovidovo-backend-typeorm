import {Arg, Mutation, Resolver} from 'type-graphql';
import {ImageFile} from '../entities/ImageFileEntity';
import {Readable} from 'stream';
import {GraphQLUpload} from 'graphql-upload';
import path from 'path';
import mime from 'mime-types';
import {createWriteStream} from 'fs';
import {FILE_TYPE_REGEXP, PATH} from '../config';
import {ErrorTitles, throwCustomError} from "../../../common/errors";
import * as fs from "fs";

export interface Upload {
    createReadStream: () => Readable;
    filename: string;
    mimetype: string;
    encoding: string;
}

@Resolver(of => ImageFile)
export class ImageFileResolver {
    @Mutation(returns => ImageFile, { nullable: false })
    async uploadImage(@Arg('file', type => GraphQLUpload) file: Upload): Promise<ImageFile> {
        const { createReadStream, filename, mimetype, encoding } = await file;

        const uniqueName = getUniqueName(file);
        const isImage = isFileExtensionValid(filename, mimetype, FILE_TYPE_REGEXP);

        if (!fs.existsSync(PATH)) {
            fs.mkdir(PATH, err => 'Failed to create UPLOAD folder');
        }

        const stream = createReadStream();

        if (isImage) {
            return new Promise((resolve, reject) =>
                stream
                    .pipe(createWriteStream(`${PATH}/${uniqueName}`))
                    .on('finish', () => resolve({ filename: uniqueName, mimetype, encoding, imageUrl: `${PATH}/${uniqueName}`}))
                    .on('error', () => throwCustomError(ErrorTitles.ImageSavingFailed)),
            );
        }

        throwCustomError(ErrorTitles.ImageHasWrongFormat);
    }
}

const isFileExtensionValid = (filename: string, mimetype: string, filetypes: RegExp) => {
    const hasCorrectMimetype = filetypes.test(mimetype);
    const hasCorrectExtname = filetypes.test(path.extname(filename).toLowerCase());
    return hasCorrectMimetype && hasCorrectExtname;
};

const getUniqueName = (file: Upload): string => {
    const extension = mime.extension(file.mimetype);
    return Date.now() + '.' + extension;
};
