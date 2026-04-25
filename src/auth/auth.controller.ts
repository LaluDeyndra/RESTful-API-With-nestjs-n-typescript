import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Ini berarti rutenya: http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Ini berarti rutenya: http://localhost:3000/auth/login
  async login(@Body() body: Record<string, any>) {
    // Controller ini akan menerima data dari Body Request,
    // lalu melemparnya ke pabrik token (AuthService) yang tadi kita buat
    return this.authService.login(body.email, body.password);
  }
}
