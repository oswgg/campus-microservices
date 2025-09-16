export interface AccessPayload {
    /**
     * The unique identifier of the user.
     */
    id: any;

    /**
     * The email of the user.
     */
    email: string;

    /**
     * The application that user has access to.
     */
    app: string;
}
