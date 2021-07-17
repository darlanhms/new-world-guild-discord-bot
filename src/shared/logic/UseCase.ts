export default interface UseCase<D, T> {
    execute(infos: D): T | Promise<T>;
}
