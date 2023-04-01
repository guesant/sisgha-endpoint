import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DiarioModule } from '../diario/diario.module';
import { LugarModule } from '../lugar/lugar.module';
import { SemanaModule } from '../semana/semana.module';
import { TurnoAulaModule } from '../turno-aula/turno-aula.module';
import { AulaResolver } from './aula.resolver';
import { AulaService } from './aula.service';

@Module({
  imports: [
    DatabaseModule,
    DiarioModule,
    SemanaModule,
    TurnoAulaModule,
    LugarModule,
  ],
  exports: [AulaService],
  providers: [AulaService, AulaResolver],
})
export class AulaModule {}