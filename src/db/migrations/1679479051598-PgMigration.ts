import { MigrationInterface, QueryRunner } from "typeorm";

export class PgMigration1679479051598 implements MigrationInterface {
    name = 'PgMigration1679479051598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unit" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "headId" integer, "departmentId" integer, CONSTRAINT "REL_3fb47d0da0b6070496f028bf89" UNIQUE ("headId"), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "headId" integer, CONSTRAINT "REL_704562fff92144d2bc2ade1016" UNIQUE ("headId"), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advance_details_product_enum" AS ENUM('accommodation', 'per diem', 'taxi')`);
        await queryRunner.query(`CREATE TABLE "advance_details" ("id" SERIAL NOT NULL, "product" "public"."advance_details_product_enum" NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "number" integer NOT NULL, "remark" character varying NOT NULL, "advanceFormId" integer, CONSTRAINT "PK_b6f7fbfaff1472afed14035e5a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."expense_details_product_enum" AS ENUM('accommodation', 'per diem', 'taxi')`);
        await queryRunner.query(`CREATE TABLE "expense_details" ("id" SERIAL NOT NULL, "product" "public"."expense_details_product_enum" NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "number" integer NOT NULL, "remark" character varying NOT NULL, "retirementFormId" integer, CONSTRAINT "PK_8012987d153b25cc960f171b920" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_type_enum" AS ENUM('advance', 'retirement')`);
        await queryRunner.query(`CREATE TABLE "approvals" ("id" SERIAL NOT NULL, "approvedOn" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."approvals_type_enum" NOT NULL, "level" integer NOT NULL, "remark" character varying NOT NULL, "approvedById" integer, "advanceApprovedId" integer, "retirementApprovedId" integer, CONSTRAINT "REL_3eec3dab3d9bfae510e24cf8d2" UNIQUE ("approvedById"), CONSTRAINT "PK_690417aaefa84d18b1a59e2a499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supporting_docs" ("id" SERIAL NOT NULL, "documentDescription" character varying NOT NULL, "file" bytea, "retirementFormId" integer, CONSTRAINT "PK_5b105234d8a0f6b75eb8c66773a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_form_type_enum" AS ENUM('cash', 'advance')`);
        await queryRunner.query(`CREATE TABLE "retirement_form" ("id" SERIAL NOT NULL, "purpose" character varying NOT NULL, "depatureDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP NOT NULL, "type" "public"."retirement_form_type_enum" NOT NULL, "preApprovalRemarkByFinance" character varying, "approvalLevel" integer NOT NULL, "nextApprovalLevel" integer NOT NULL, "delegatedByPD" boolean NOT NULL DEFAULT false, "pushedToFinance" boolean NOT NULL DEFAULT false, "approvedByFin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "remarkByFin" character varying NOT NULL, "balanceToStaff" integer NOT NULL, "balanceToOrganization" integer NOT NULL, "userId" integer, CONSTRAINT "PK_2790fa54ad959e79fef183ac638" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advance_form" ("id" SERIAL NOT NULL, "purpose" character varying NOT NULL, "depatureDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP NOT NULL, "origination" character varying NOT NULL, "destination" character varying NOT NULL, "preApprovalRemarkByFinance" character varying, "approvalLevel" integer NOT NULL, "nextApprovalLevel" integer NOT NULL, "delegatedByPD" boolean NOT NULL DEFAULT false, "pushedToFinance" boolean NOT NULL DEFAULT false, "approvedByFin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "remarkByFin" character varying NOT NULL, "totalAmount" integer NOT NULL, "userId" integer, "retirementId" integer, CONSTRAINT "REL_560a468e3547dd7b4e56681676" UNIQUE ("retirementId"), CONSTRAINT "PK_97adc511b6b672cf19a63009344" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "verificationToken" character varying, "verified" TIMESTAMP, "supervisorId" integer, "unitId" integer, "departmentId" integer, "role" "public"."user_role_enum" NOT NULL DEFAULT '0', "passwordToken" character varying, "passwordTokenExpiration" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "FK_c93ddd4d9643186a0db8c26234c" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "FK_3fb47d0da0b6070496f028bf896" FOREIGN KEY ("headId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_704562fff92144d2bc2ade1016a" FOREIGN KEY ("headId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_details" ADD CONSTRAINT "FK_c00ad2bc4eec151cc233919cac0" FOREIGN KEY ("advanceFormId") REFERENCES "advance_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_details" ADD CONSTRAINT "FK_874cca354cf9b356ae25f639108" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b" FOREIGN KEY ("advanceApprovedId") REFERENCES "advance_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4" FOREIGN KEY ("retirementApprovedId") REFERENCES "retirement_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retirement_form" ADD CONSTRAINT "FK_12c1f9140c6a078a7f001ae91ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_form" ADD CONSTRAINT "FK_b6420a228e3e9769e040889cf17" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_form" ADD CONSTRAINT "FK_560a468e3547dd7b4e566816764" FOREIGN KEY ("retirementId") REFERENCES "retirement_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_856a1f0347b672d3b8bb4693bd8" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5eee61d80509271c4bd366995ec" FOREIGN KEY ("supervisorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5eee61d80509271c4bd366995ec"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_856a1f0347b672d3b8bb4693bd8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "advance_form" DROP CONSTRAINT "FK_560a468e3547dd7b4e566816764"`);
        await queryRunner.query(`ALTER TABLE "advance_form" DROP CONSTRAINT "FK_b6420a228e3e9769e040889cf17"`);
        await queryRunner.query(`ALTER TABLE "retirement_form" DROP CONSTRAINT "FK_12c1f9140c6a078a7f001ae91ae"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23"`);
        await queryRunner.query(`ALTER TABLE "expense_details" DROP CONSTRAINT "FK_874cca354cf9b356ae25f639108"`);
        await queryRunner.query(`ALTER TABLE "advance_details" DROP CONSTRAINT "FK_c00ad2bc4eec151cc233919cac0"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_704562fff92144d2bc2ade1016a"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_3fb47d0da0b6070496f028bf896"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_c93ddd4d9643186a0db8c26234c"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "advance_form"`);
        await queryRunner.query(`DROP TABLE "retirement_form"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_form_type_enum"`);
        await queryRunner.query(`DROP TABLE "supporting_docs"`);
        await queryRunner.query(`DROP TABLE "approvals"`);
        await queryRunner.query(`DROP TYPE "public"."approvals_type_enum"`);
        await queryRunner.query(`DROP TABLE "expense_details"`);
        await queryRunner.query(`DROP TYPE "public"."expense_details_product_enum"`);
        await queryRunner.query(`DROP TABLE "advance_details"`);
        await queryRunner.query(`DROP TYPE "public"."advance_details_product_enum"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "unit"`);
    }

}
