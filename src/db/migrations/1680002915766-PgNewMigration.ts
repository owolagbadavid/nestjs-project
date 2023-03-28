import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1680002915766 implements MigrationInterface {
    name = 'PgNewMigration1680002915766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ALTER COLUMN "nextApprovalLevel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advance_form" ALTER COLUMN "nextApprovalLevel" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_form" ALTER COLUMN "nextApprovalLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "retirement_form" ALTER COLUMN "nextApprovalLevel" SET NOT NULL`);
    }

}
