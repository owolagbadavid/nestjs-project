import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1680002724768 implements MigrationInterface {
    name = 'PgNewMigration1680002724768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ADD "rejectionReason" character varying`);
        await queryRunner.query(`ALTER TABLE "retirement_form" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "advance_form" ADD "rejectionReason" character varying`);
        await queryRunner.query(`ALTER TABLE "advance_form" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_form" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "advance_form" DROP COLUMN "rejectionReason"`);
        await queryRunner.query(`ALTER TABLE "retirement_form" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "retirement_form" DROP COLUMN "rejectionReason"`);
    }

}
