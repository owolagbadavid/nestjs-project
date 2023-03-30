import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1680165766226 implements MigrationInterface {
    name = 'PgNewMigration1680165766226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD "fileName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD "mimeType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD "encoding" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP COLUMN "encoding"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP COLUMN "fileName"`);
    }

}
