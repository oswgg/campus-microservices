export interface DomainApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface TokenOutput {
    token: string;
}
