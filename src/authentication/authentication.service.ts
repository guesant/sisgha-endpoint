import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Client } from 'openid-client';
import { DataSource } from 'typeorm';
import { Actor } from '../actor-context/Actor';
import { ActorContext } from '../actor-context/ActorContext';
import { UsuarioService } from '../app/modules/usuario/usuario.service';
import { IS_PRODUCTION_MODE } from '../common/constants/IS_PRODUCTION_MODE.const';
import { DATA_SOURCE } from '../database/constants/DATA_SOURCE';
import { OPENID_CLIENT } from './constants/OPENID_CLIENT.const';

@Injectable()
export class AuthenticationService {
  constructor(
    private usuarioService: UsuarioService,
    // ...
    @Inject(OPENID_CLIENT)
    private openIDClient: Client,
    // ...
    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
  ) {}

  async getAuthedUser(appContext: ActorContext) {
    const { actor } = appContext;

    const { user } = actor;

    if (!user) {
      throw new BadRequestException("You're not logged in");
    }

    return this.usuarioService.findUsuarioByIdStrictSimple(appContext, user.id);
  }

  async validateAccessToken(accessToken?: string | any) {
    const appContext = new ActorContext(this.dataSource, Actor.forSystemInternalActions());

    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const user = await this.usuarioService.getUsuarioFromKeycloakId(appContext, userinfo.sub);

      return user;
    } catch (err) {
      if (!IS_PRODUCTION_MODE) {
        console.error('auth err:', { err });
      }

      throw err;
    }
  }

  async getUsuarioResourceActionRequest(userId: number) {
    return Actor.forUser(userId);
  }
}
