import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesPeriodoDia1679180212866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read periodo_dia"
      ON periodo_dia
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with cargo 'dape' can manage periodo_dia"
      ON periodo_dia
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT * FROM authed_user_has_cargo('dape')
        )
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP POLICY "Everyone can read periodo_dia" ON periodo_dia;`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with cargo 'dape' can manage periodo_dia" ON periodo_dia;`,
    );
  }
}