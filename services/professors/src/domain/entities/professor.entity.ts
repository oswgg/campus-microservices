export class Professor {
    constructor(
        readonly id: number | bigint,
        readonly name: string,
        readonly institutionalEmail: string,
        readonly institutionalPassword: string,
    ) {}
}
