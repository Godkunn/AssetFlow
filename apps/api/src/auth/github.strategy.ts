import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:4000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const { id, username, emails, photos } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const picture = photos && photos[0] ? photos[0].value : null;

    const user = {
      email: email || `${username || id}@github.local`,
      firstName: username || profile.displayName || 'GitHubUser',
      lastName: '',
      picture,
      githubId: id,
    };
    done(null, user);
  }
}
