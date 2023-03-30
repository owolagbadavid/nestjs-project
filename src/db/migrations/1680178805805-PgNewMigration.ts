import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1680178805805 implements MigrationInterface {
    name = 'PgNewMigration1680178805805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ADD "financeGoAhead" boolean`);
        await queryRunner.query(`ALTER TABLE "advance_form" ADD "financeGoAhead" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_form" DROP COLUMN "financeGoAhead"`);
        await queryRunner.query(`ALTER TABLE "retirement_form" DROP COLUMN "financeGoAhead"`);
    }

}
