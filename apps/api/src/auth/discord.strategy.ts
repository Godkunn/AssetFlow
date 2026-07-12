import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID')!,
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:4000/auth/discord/callback',
      scope: ['identify', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    // profile contains discord user info
    const { id, username, email, avatar } = profile;
    const user = {
      email,
      firstName: username,
      lastName: '', // Discord doesn't split names
      picture: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null,
      discordId: id,
    };
    done(null, user);
  }
}
