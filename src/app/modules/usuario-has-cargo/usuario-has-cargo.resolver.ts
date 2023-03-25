import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { ResolveAppContext } from 'src/infrastructure/app-context/ResolveAppContext';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { CargoType } from '../cargo/cargo.type';
import { UsuarioType } from '../usuario/usuario.type';
import {
  AddCargoToUsuarioInputType,
  AddCargoToUsuarioInputZod,
  RemoveCargoFromUsuarioInputType,
  RemoveCargoFromUsuarioInputZod,
} from './dtos';
import { UsuarioHasCargoService } from './usuario-has-cargo.service';
import { UsuarioHasCargoType } from './usuario-has-cargo.type';

@Resolver(() => UsuarioHasCargoType)
export class UsuarioResolver {
  constructor(private usuarioHasCargoService: UsuarioHasCargoService) {}

  // START: queries

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioHasCargoType)
  async addCargoToUsuario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', AddCargoToUsuarioInputZod)
    dto: AddCargoToUsuarioInputType,
  ) {
    return this.usuarioHasCargoService.addCargoToUsuario(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeCargoFromUsuario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', RemoveCargoFromUsuarioInputZod)
    dto: RemoveCargoFromUsuarioInputType,
  ) {
    return this.usuarioHasCargoService.removeCargoFromUsuario(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('usuario', () => UsuarioType)
  async usuario(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: UsuarioHasCargoType,
  ) {
    return this.usuarioHasCargoService.getUsuarioHasCargoUsuario(
      appContext,
      parent.id,
    );
  }

  @ResolveField('cargo', () => CargoType)
  async cargo(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: UsuarioHasCargoType,
  ) {
    return this.usuarioHasCargoService.getUsuarioHasCargoCargo(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}