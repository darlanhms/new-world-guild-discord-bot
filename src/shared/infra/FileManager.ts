export default interface FileManager {
    get(name: string): Promise<Buffer | undefined>;
    create(name: string, body: string): Promise<void>;
    update(name: string, newBody: string): Promise<void>;
    delete(name: string): Promise<void>;
}
