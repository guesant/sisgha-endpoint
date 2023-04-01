import { Injectable, NotFoundException } from '@nestjs/common';
import { TurmaHasTurnoAulaDbEntity } from 'src/app/entities/turma-has-turno-aula.db.entity';
import { TurmaDbEntity } from 'src/app/entities/turma.db.entity';
import { TurnoAulaDbEntity } from 'src/app/entities/turno-aula.db.entity';
import { getTurmaHasTurnoAulaRepository } from 'src/app/repositories/turma-has-turno-aula.repository';
import { getTurmaRepository } from 'src/app/repositories/turma.repository';
import { getTurnoAulaRepository } from 'src/app/repositories/turno-aula.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import { TurmaService } from '../turma/turma.service';
import { TurnoAulaService } from '../turno-aula/turno-aula.service';
import {
  IAddTurnoAulaToTurmaInput,
  IFindTurmaHasTurnoAulaByIdInput,
  IFindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput,
  IRemoveTurnoAulaFromTurmaInput,
} from './dtos';

@Injectable()
export class TurmaHasTurnoAulaService {
  constructor(
    private turmaService: TurmaService,
    private turnoAulaService: TurnoAulaService,
  ) {}

  async findTurmaHasTurnoAulaById(
    appContext: AppContext,
    dto: IFindTurmaHasTurnoAulaByIdInput,
    options?: FindOneOptions<TurmaHasTurnoAulaDbEntity>,
  ) {
    const { id } = dto;

    const targetTurmaHasTurnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turmaHasTurnoAulaRepository =
          getTurmaHasTurnoAulaRepository(entityManager);

        return turmaHasTurnoAulaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetTurmaHasTurnoAula) {
      return null;
    }

    const turmaHasTurnoAula =
      await appContext.databaseRun<TurmaHasTurnoAulaDbEntity>(
        async ({ entityManager }) => {
          const turmaHasTurnoAulaRepository =
            getTurmaHasTurnoAulaRepository(entityManager);

          return await turmaHasTurnoAulaRepository.findOneOrFail({
            where: { id: targetTurmaHasTurnoAula.id },
            select: ['id'],
            ...options,
          });
        },
      );

    return turmaHasTurnoAula;
  }

  async findTurmaHasTurnoAulaByIdStrict(
    appContext: AppContext,
    dto: IFindTurmaHasTurnoAulaByIdInput,
    options?: FindOneOptions<TurmaHasTurnoAulaDbEntity>,
  ) {
    const turmaHasTurnoAula = await this.findTurmaHasTurnoAulaById(
      appContext,
      dto,
      options,
    );

    if (!turmaHasTurnoAula) {
      throw new NotFoundException();
    }

    return turmaHasTurnoAula;
  }

  async findTurmaHasTurnoAulaByIdStrictSimple(
    appContext: AppContext,
    turmaHasTurnoAulaId: number,
  ): Promise<Pick<TurmaHasTurnoAulaDbEntity, 'id'>> {
    const turmaHasTurnoAula = await this.findTurmaHasTurnoAulaByIdStrict(
      appContext,
      {
        id: turmaHasTurnoAulaId,
      },
    );

    return turmaHasTurnoAula as Pick<TurmaHasTurnoAulaDbEntity, 'id'>;
  }

  async findTurmaHasTurnoAulaByTurnoAulaIdAndTurmaId(
    appContext: AppContext,
    dto: IFindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput,
  ) {
    const { turmaId, turnoAulaId } = dto;

    const turmaHasTurnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turmaHasTurnoAulaRepository =
          getTurmaHasTurnoAulaRepository(entityManager);

        return turmaHasTurnoAulaRepository
          .createQueryBuilder('turma_has_turno_aula')
          .innerJoin('turma_has_turno_aula.turma', 'turma')
          .innerJoin('turma_has_turno_aula.turnoAula', 'turno_aula')
          .where('turma.id = :turmaId', { turmaId })
          .andWhere('turno_aula.id = :turnoAulaId', { turnoAulaId })
          .select(['turma_has_turno_aula.id'])
          .getOne();
      },
    );

    return turmaHasTurnoAula;
  }

  async findTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdStrict(
    appContext: AppContext,
    dto: IFindTurmaHasTurnoAulaByTurnoAulaIdAndTurmaIdInput,
  ) {
    const turmaHasTurnoAula =
      await this.findTurmaHasTurnoAulaByTurnoAulaIdAndTurmaId(appContext, dto);

    if (!turmaHasTurnoAula) {
      throw new NotFoundException();
    }

    return turmaHasTurnoAula;
  }

  async getTurmaHasTurnoAulaGenericField<
    K extends keyof TurmaHasTurnoAulaDbEntity,
  >(
    appContext: AppContext,
    turmaHasTurnoAulaId: number,
    field: K,
  ): Promise<TurmaHasTurnoAulaDbEntity[K]> {
    const turmaHasTurnoAula = await this.findTurmaHasTurnoAulaByIdStrict(
      appContext,
      { id: turmaHasTurnoAulaId },
      { select: ['id', field] },
    );

    return <TurmaHasTurnoAulaDbEntity[K]>turmaHasTurnoAula[field];
  }

  /*
  async getTurmaHasTurnoAulaGenericField(appContext: AppContext, turmaHasTurnoAulaId: number) {
    return this.getTurmaHasTurnoAulaGenericField(appContext, turmaHasTurnoAulaId, 'genericField');
  }
  */

  async getTurmaHasTurnoAulaTurma(
    appContext: AppContext,
    turmaHasTurnoAulaId: number,
  ) {
    const turmaHasTurnoAula = await this.findTurmaHasTurnoAulaByIdStrictSimple(
      appContext,
      turmaHasTurnoAulaId,
    );

    const turma = await appContext.databaseRun(async ({ entityManager }) => {
      const turmaRepository = getTurmaRepository(entityManager);

      return turmaRepository
        .createQueryBuilder('turma')
        .innerJoin('turma.turmaHasTurnoAula', 'turma_has_turno_aula')
        .where('turma_has_turno_aula.id = :id', { id: turmaHasTurnoAula.id })
        .select(['turma.id'])
        .getOne();
    });

    return turma;
  }

  async getTurmaHasTurnoAulaTurnoAula(
    appContext: AppContext,
    turmaHasTurnoAulaId: number,
  ) {
    const turmaHasTurnoAula = await this.findTurmaHasTurnoAulaByIdStrictSimple(
      appContext,
      turmaHasTurnoAulaId,
    );

    const turnoAula = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turnoAulaRepository = getTurnoAulaRepository(entityManager);

        return turnoAulaRepository
          .createQueryBuilder('turno_aula')
          .innerJoin('turno_aula.turmaHasTurnoAula', 'turma_has_turno_aula')
          .where('turma_has_turno_aula.id = :id', { id: turmaHasTurnoAula.id })
          .select(['turno_aula.id'])
          .getOne();
      },
    );

    return turnoAula;
  }

  async addTurnoAulaToTurma(
    appContext: AppContext,
    dto: IAddTurnoAulaToTurmaInput,
  ) {
    const turmaHasTurnoAulaAlreadyExists =
      await this.findTurmaHasTurnoAulaByTurnoAulaIdAndTurmaId(appContext, {
        turmaId: dto.turmaId,
        turnoAulaId: dto.turnoAulaId,
      });

    if (turmaHasTurnoAulaAlreadyExists) {
      return turmaHasTurnoAulaAlreadyExists;
    }

    const turmaHasTurnoAula = <TurmaHasTurnoAulaDbEntity>{};

    const turma = await this.turmaService.findTurmaByIdStrictSimple(
      appContext,
      dto.turmaId,
    );

    turmaHasTurnoAula.turma = <TurmaDbEntity>turma;

    const turnoAula = await this.turnoAulaService.findTurnoAulaByIdStrictSimple(
      appContext,
      dto.turnoAulaId,
    );

    turmaHasTurnoAula.turnoAula = <TurnoAulaDbEntity>turnoAula;

    await appContext.databaseRun(async ({ entityManager }) => {
      const turmaHasTurnoAulaRepository =
        getTurmaHasTurnoAulaRepository(entityManager);

      await turmaHasTurnoAulaRepository.save(turmaHasTurnoAula);

      return turmaHasTurnoAula;
    });

    return this.findTurmaHasTurnoAulaByIdStrictSimple(
      appContext,
      turmaHasTurnoAula.id,
    );
  }

  async removeTurnoAulaFromTurma(
    appContext: AppContext,
    dto: IRemoveTurnoAulaFromTurmaInput,
  ) {
    const turmaHasTurnoAula =
      await this.findTurmaHasTurnoAulaByTurnoAulaIdAndTurmaId(appContext, {
        turmaId: dto.turmaId,
        turnoAulaId: dto.turnoAulaId,
      });

    if (!turmaHasTurnoAula) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const turmaHasTurnoAulaRepository =
        getTurmaHasTurnoAulaRepository(entityManager);

      try {
        await turmaHasTurnoAulaRepository.delete(turmaHasTurnoAula.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}