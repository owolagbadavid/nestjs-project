import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1679839041320 implements MigrationInterface {
    name = 'PgNewMigration1679839041320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ALTER COLUMN "remarkByFin" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_form" ALTER COLUMN "remarkByFin" SET NOT NULL`);
    }

}
