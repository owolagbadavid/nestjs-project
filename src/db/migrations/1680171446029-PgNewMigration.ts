import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1680171446029 implements MigrationInterface {
    name = 'PgNewMigration1680171446029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ADD "totalAmount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" DROP COLUMN "totalAmount"`);
    }

}
