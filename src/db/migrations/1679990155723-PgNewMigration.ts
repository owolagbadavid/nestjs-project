import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1679990155723 implements MigrationInterface {
    name = 'PgNewMigration1679990155723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "REL_3eec3dab3d9bfae510e24cf8d2"`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b" FOREIGN KEY ("advanceApprovedId") REFERENCES "advance_form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4" FOREIGN KEY ("retirementApprovedId") REFERENCES "retirement_form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23"`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "REL_3eec3dab3d9bfae510e24cf8d2" UNIQUE ("approvedById")`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4" FOREIGN KEY ("retirementApprovedId") REFERENCES "retirement_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b" FOREIGN KEY ("advanceApprovedId") REFERENCES "advance_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
