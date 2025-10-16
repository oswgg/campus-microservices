import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ApiKeyController {
    @MessagePattern({ cmd: 'api-key.verify' })
    validateApiKey(@Body() body: { api_key: string; required_app: string }) {
        console.log('Validating API Key:', body);
        const { api_key, required_app } = body;

        return { valid: true, apiKey: api_key, app: required_app };
    }
}
