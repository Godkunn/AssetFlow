import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

function makeAuthResponse(provider: string, authResult: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>Authentication Success</title></head>
    <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'oauth-success',
            provider: '${provider}',
            token: '${authResult.token}',
            session: ${JSON.stringify(authResult.user)}
          }, '${FRONTEND_URL}');
          window.close();
        } else {
          document.body.innerHTML = '<h2>Authentication Successful! You can close this tab.</h2>';
        }
      </script>
    </body>
    </html>
  `;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* ─── Google OAuth ──────────────────────────────────────────────── */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const authResult = await this.authService.validateOAuthUser(req.user);
    res.send(makeAuthResponse('Google', authResult));
  }

  /* ─── Discord OAuth ─────────────────────────────────────────────── */
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req: any) {
    // Initiates the Discord OAuth flow
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req: any, @Res() res: any) {
    const authResult = await this.authService.validateOAuthUser(req.user);
    res.send(makeAuthResponse('Discord', authResult));
  }

  /* ─── GitHub OAuth ──────────────────────────────────────────────── */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req: any) {
    // Initiates the GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: any, @Res() res: any) {
    const authResult = await this.authService.validateOAuthUser(req.user);
    res.send(makeAuthResponse('GitHub', authResult));
  }
}
