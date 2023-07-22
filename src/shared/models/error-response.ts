import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

/**
 * Permet de générer une classe qui sera renvoyée en cas d'erreur HTTP
 */
export class ErrorResponse {
    message: string;
    source: any;
    constructor(errorMessage?: string, errorSource?: any) {
        this.message = errorMessage;
        this.source = errorSource;
    }
}
