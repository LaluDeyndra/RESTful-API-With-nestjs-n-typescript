import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // Untuk nyari data user di database
    private jwtService: JwtService, // Untuk nyetak token
  ) {}

  async login(email: string, pass: string) {
    // 1. Cari user di database berdasarkan email
    // Catatan: Pastikan di UserService kamu ada fungsi findByEmail() atau yang serupa
    const user = await this.userService.findByEmail(email);

    // 2. Cek apakah user ada DAN passwordnya cocok
    // PERINGATAN: Untuk saat ini kita pakai perbandingan password biasa.
    // Nanti untuk level production, kamu WAJIB pakai bcrypt (hash password)!
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Email atau password salah bro!');
    }

    // 3. Jika benar, siapkan "Payload" (Data yang diselipkan ke dalam Token)
    // Ingat: Jangan PERNAH memasukkan password ke dalam payload!
    const payload = { sub: user.id, email: user.email };

    // 4. Cetak dan kembalikan tokennya
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
