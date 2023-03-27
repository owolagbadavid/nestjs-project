import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1679917445023 implements MigrationInterface {
    name = 'PgNewMigration1679917445023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_details" DROP CONSTRAINT "FK_874cca354cf9b356ae25f639108"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3"`);
        await queryRunner.query(`ALTER TABLE "expense_details" ADD CONSTRAINT "FK_874cca354cf9b356ae25f639108" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3"`);
        await queryRunner.query(`ALTER TABLE "expense_details" DROP CONSTRAINT "FK_874cca354cf9b356ae25f639108"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_details" ADD CONSTRAINT "FK_874cca354cf9b356ae25f639108" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
