import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  SetMetadata,
  ExecutionContext,
  Injectable,
  CanActivate
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User, UserRole } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { Reflector } from '@nestjs/core';

// Roles decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ 
    status: 200, 
    description: 'User details retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
  })
  getProfile(@GetUser() user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin only endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin access granted',
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - requires admin role',
  })
  adminOnly() {
    return { message: 'Admin access granted' };
  }
}