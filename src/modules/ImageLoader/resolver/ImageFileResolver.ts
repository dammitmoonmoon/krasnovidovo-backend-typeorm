import { Arg, Mutation, Resolver } from 'type-graphql';
import { ImageFile, ImageParams } from '../entities/ImageFileEntity';
import { Readable } from 'stream';
import { GraphQLUpload } from 'graphql-upload';
import path from 'path';
import mime from 'mime-types';
import { createWriteStream } from 'fs';
import { FILE_TYPE_REGEXP, HOST, PATH } from '../config';
import { ErrorCodes, throwCustomError } from '../../../common/errors';
import * as fs from 'fs';
import crypto from 'crypto';
import { getRepository, Repository } from 'typeorm';

export interface Upload {
    createReadStream: () => Readable;
    filename: string;
    mimetype: string;
    encoding: string;
}

@Resolver(of => ImageFile)
export class ImageFileResolver {
    private readonly repository: Repository<ImageParams>;
    constructor() {
        this.repository = getRepository(ImageParams);
    }
    @Mutation(returns => ImageFile, { nullable: false })
    async uploadImage(@Arg('file', type => GraphQLUpload) file: Upload): Promise<ImageFile> {
        const { createReadStream, filename, mimetype, encoding } = await file;

        const hash = crypto.createHash('sha1');
        hash.setEncoding('hex');

        const uniqueName = getUniqueName(file);
        const fileExtension = getExtension(file);
        isFileExtensionValid(filename, mimetype, FILE_TYPE_REGEXP) || throwCustomError(ErrorCodes.wrong_image_format);

        let imageHash: string;

        if (!fs.existsSync(PATH)) {
            fs.mkdir(PATH, err => 'Failed to create UPLOAD folder');
        }

        const readStream = createReadStream();
        const writeStream = createWriteStream(`${PATH}/temp.${fileExtension}`);

        readStream.on('error', () => throwCustomError(ErrorCodes.image_saving_failed));
        writeStream.on('error', () => throwCustomError(ErrorCodes.image_saving_failed));

        return new Promise(resolve => {
            readStream.pipe(hash).on('finish', () => {
                hash.end();
                imageHash = hash.read();
            });

            readStream.pipe(writeStream).on('finish', () => {

                this.repository.findOne({ id: imageHash }).then(existingImage => {
                    if (existingImage) {
                        removeTempFile(fileExtension);
                        return resolve({ filename: existingImage.fileName, mimetype, encoding, imageUrl: existingImage.imageUrl });
                    } else {
                        saveImageParamsToDB(imageHash, uniqueName);
                        createPermanentImageFile(fileExtension, uniqueName);
                        removeTempFile(fileExtension);
                        return resolve({ filename: uniqueName, mimetype, encoding, imageUrl: `${HOST}/${uniqueName}` });
                    }
                });
            });
        });
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

const getExtension = (file: Upload): string => {
    const extension = mime.extension(file.mimetype);
    return extension;
};

const removeTempFile = (fileExtension: string) => {
    fs.unlink(`${PATH}/temp.${fileExtension}`, err => {
        if (err) throwCustomError(ErrorCodes.image_saving_failed);
    });
};

const createPermanentImageFile = (fileExtension: string, uniqueName: string) => {
    fs.copyFile(`${PATH}/temp.${fileExtension}`, `${PATH}/${uniqueName}`, err => {
        if (err) throwCustomError(ErrorCodes.image_saving_failed);
    });
};

const saveImageParamsToDB = (imageHash: string, uniqueName: string) => {
    const imageParams = {
        id: imageHash,
        imageUrl: `${HOST}/${uniqueName}`,
        fileName: uniqueName,
    };
    this.repository.save(imageParams).catch(err => console.log(err));
};
