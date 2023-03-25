import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { ResolveAppContext } from 'src/infrastructure/app-context/ResolveAppContext';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { DiaSemanaService } from './dia-semana.service';
import { DiaSemanaType } from './dia-semana.type';
import {
  CreateDiaSemanaInputType,
  CreateDiaSemanaInputZod,
  DeleteDiaSemanaInputType,
  DeleteDiaSemanaInputZod,
  FindDiaSemanaByIdInputType,
  FindDiaSemanaByIdInputZod,
  UpdateDiaSemanaInputType,
  UpdateDiaSemanaInputZod,
} from './dtos';

@Resolver(() => DiaSemanaType)
export class DiaSemanaResolver {
  constructor(private diaSemanaService: DiaSemanaService) {}

  // START: queries

  @Query(() => DiaSemanaType)
  async findDiaSemanaById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindDiaSemanaByIdInputZod)
    dto: FindDiaSemanaByIdInputType,
  ) {
    return this.diaSemanaService.findDiaSemanaByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => DiaSemanaType)
  async createDiaSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateDiaSemanaInputZod)
    dto: CreateDiaSemanaInputType,
  ) {
    return this.diaSemanaService.createDiaSemana(appContext, dto);
  }

  @Mutation(() => DiaSemanaType)
  async updateDiaSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateDiaSemanaInputZod)
    dto: UpdateDiaSemanaInputType,
  ) {
    return this.diaSemanaService.updateDiaSemana(appContext, dto);
  }

  @Mutation(() => DiaSemanaType)
  async deleteDiaSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteDiaSemanaInputZod)
    dto: DeleteDiaSemanaInputType,
  ) {
    return this.diaSemanaService.deleteDiaSemana(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('ordem', () => String, { nullable: true })
  async ordem(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DiaSemanaType,
  ) {
    return this.diaSemanaService.getDiaSemanaOrdem(appContext, parent.id);
  }

  // END: fields resolvers
}