import { 
  Injectable, 
  ConflictException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// JWT Payload interface
interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { username, password, role = UserRole.USER } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ 
      where: { username } 
    });
    
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { username, password } = loginDto;
    
    // Find user
    const user = await this.usersRepository.findOne({ 
      where: { username } 
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload: JwtPayload = { 
      sub: user.id,
      username: user.username,
      role: user.role
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Create an admin user if none exists
  async createAdminIfNotExists(): Promise<void> {
    const adminExists = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN }
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = this.usersRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN
      });

      await this.usersRepository.save(adminUser);
      console.log('Admin user created');
    }
  }
}