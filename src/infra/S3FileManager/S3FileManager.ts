import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import FileManager from '../../shared/infra/FileManager';

const s3Client = new S3Client({
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.ACCESS_KEY_SECRET || '',
    },
});

const bucketName = process.env.NODE_ENV === 'production' ? 'guildbotprod' : 'guildbotdev';

export default class S3FileManager implements FileManager {
    async create(name: string, body: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: name,
            Body: body,
        });

        await s3Client.send(command);
    }

    async update(name: string, newBody: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: name,
            Body: newBody,
        });

        await s3Client.send(command);
    }

    async delete(name: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: name,
        });

        await s3Client.send(command);
    }

    async get(name: string): Promise<Buffer | undefined> {
        return new Promise(resolve => {
            try {
                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: name,
                });

                s3Client
                    .send(command)
                    .then(response => {
                        const chunks: Buffer[] = [];

                        response.Body.on('data', (blob: Buffer) => {
                            chunks.push(blob);
                        });

                        response.Body.on('error', (blob: Buffer) => {
                            resolve(blob);
                        });

                        response.Body.on('end', () => {
                            resolve(Buffer.concat(chunks));
                        });
                    })
                    .catch(() => resolve(undefined));
            } catch (error) {
                resolve(undefined);
            }
        });
    }
}
