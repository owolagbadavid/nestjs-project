import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1679771494977 implements MigrationInterface {
    name = 'PgNewMigration1679771494977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_details" DROP COLUMN "advanceformId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advance_details" ADD "advanceformId" integer`);
    }

}
