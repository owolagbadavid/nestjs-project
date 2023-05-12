import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1683873138070 implements MigrationInterface {
    name = 'PgNewMigration1683873138070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_forms" RENAME COLUMN "depatureDate" TO "departureDate"`);
        await queryRunner.query(`ALTER TABLE "retirement_forms" RENAME COLUMN "depatureDate" TO "departureDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "retirement_forms" RENAME COLUMN "departureDate" TO "depatureDate"`);
        await queryRunner.query(`ALTER TABLE "advance_forms" RENAME COLUMN "departureDate" TO "depatureDate"`);
    }

}
