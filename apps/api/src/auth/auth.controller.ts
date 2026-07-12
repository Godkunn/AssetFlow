import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const authResult = await this.authService.validateOAuthUser(req.user);
    
    // Respond with a script that posts the session to the parent window and closes the popup
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Success</title>
      </head>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-success',
              provider: 'Google',
              token: '${authResult.token}',
              session: ${JSON.stringify(authResult.user)}
            }, '*');
            window.close();
          } else {
            document.body.innerHTML = '<h2>Authentication Successful! You can close this tab.</h2>';
          }
        </script>
      </body>
      </html>
    `);
  }
}
