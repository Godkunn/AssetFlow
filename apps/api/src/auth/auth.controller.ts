import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req: any) {
    // Initiates the Discord OAuth flow
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req: any, @Res() res: any) {
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
              provider: 'Discord',
              token: '${authResult.token}',
              session: ${JSON.stringify(authResult.user)}
            }, '${process.env.FRONTEND_URL || 'http://localhost:3001'}');
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
