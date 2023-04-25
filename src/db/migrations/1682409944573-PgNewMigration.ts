import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1682409944573 implements MigrationInterface {
    name = 'PgNewMigration1682409944573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "verificationToken" character varying, "verified" TIMESTAMP, "supervisorId" integer, "unitId" integer, "departmentId" integer, "role" "public"."users_role_enum" NOT NULL DEFAULT '0', "passwordToken" character varying, "passwordTokenExpiration" TIMESTAMP, "delegated" boolean NOT NULL DEFAULT false, "delegateId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_f4a582b56f240c4c974fabc6dd" UNIQUE ("delegateId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "headId" integer, CONSTRAINT "REL_7dfc8e5b4441db5ca69bb532a1" UNIQUE ("headId"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "headId" integer, "departmentId" integer, CONSTRAINT "REL_67d7ca900aeb1736eea1322637" UNIQUE ("headId"), CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advance_forms_approvallevel_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."advance_forms_nextapprovallevel_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "advance_forms" ("id" SERIAL NOT NULL, "userId" integer, "purpose" character varying NOT NULL, "depatureDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP NOT NULL, "origination" character varying NOT NULL, "destination" character varying NOT NULL, "preApprovalRemarkByFinance" character varying, "financeGoAhead" boolean, "approvalLevel" "public"."advance_forms_approvallevel_enum" NOT NULL, "nextApprovalLevel" "public"."advance_forms_nextapprovallevel_enum", "pushedToFinance" boolean NOT NULL DEFAULT false, "approvedByFin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "rejectionReason" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "remarkByFin" character varying, "retirementId" integer, "totalAmount" integer NOT NULL, "supervisorToken" character varying, "disbursed" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_a50172b67328804b2af46bea8e" UNIQUE ("retirementId"), CONSTRAINT "PK_86d8c596266c93e0312628098af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advance_details_product_enum" AS ENUM('accommodation', 'per diem', 'taxi', 'other')`);
        await queryRunner.query(`CREATE TABLE "advance_details" ("id" SERIAL NOT NULL, "advanceFormId" integer, "product" "public"."advance_details_product_enum" NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "number" integer NOT NULL, "remark" character varying NOT NULL, CONSTRAINT "PK_b6f7fbfaff1472afed14035e5a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_type_enum" AS ENUM('cash', 'advance')`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_approvallevel_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_nextapprovallevel_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "retirement_forms" ("id" SERIAL NOT NULL, "userId" integer, "purpose" character varying NOT NULL, "depatureDate" TIMESTAMP NOT NULL, "returnDate" TIMESTAMP NOT NULL, "type" "public"."retirement_forms_type_enum" NOT NULL, "preApprovalRemarkByFinance" character varying, "financeGoAhead" boolean, "approvalLevel" "public"."retirement_forms_approvallevel_enum" NOT NULL, "nextApprovalLevel" "public"."retirement_forms_nextapprovallevel_enum", "pushedToFinance" boolean NOT NULL DEFAULT false, "approvedByFin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "rejectionReason" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "remarkByFin" character varying, "totalAmount" integer NOT NULL, "balanceToStaff" integer NOT NULL, "balanceToOrganization" integer NOT NULL, "disbursed" boolean NOT NULL DEFAULT false, "supervisorToken" character varying, CONSTRAINT "PK_d33b40a59d6abb6191842950e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."expense_details_product_enum" AS ENUM('accommodation', 'per diem', 'taxi', 'other')`);
        await queryRunner.query(`CREATE TABLE "expense_details" ("id" SERIAL NOT NULL, "retirementFormId" integer, "product" "public"."expense_details_product_enum" NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "number" integer NOT NULL, "remark" character varying NOT NULL, CONSTRAINT "PK_8012987d153b25cc960f171b920" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_type_enum" AS ENUM('advance', 'retirement')`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "approvals" ("id" SERIAL NOT NULL, "approvedOn" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."approvals_type_enum" NOT NULL, "level" "public"."approvals_level_enum" NOT NULL, "remark" character varying NOT NULL, "approvedById" integer, "advanceApprovedId" integer, "retirementApprovedId" integer, CONSTRAINT "PK_690417aaefa84d18b1a59e2a499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supporting_docs" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "mimeType" character varying NOT NULL, "encoding" character varying NOT NULL, "documentDescription" character varying NOT NULL, "file" bytea, "retirementFormId" integer, CONSTRAINT "PK_5b105234d8a0f6b75eb8c66773a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_554d853741f2083faaa5794d2ae" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_573707d34e5b3252f03b728b3f5" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3dcbd55983fcd698c9134c2f24b" FOREIGN KEY ("supervisorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f4a582b56f240c4c974fabc6dd1" FOREIGN KEY ("delegateId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_7dfc8e5b4441db5ca69bb532a13" FOREIGN KEY ("headId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_9a238cbdc411387b8a96cfa6a9a" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_67d7ca900aeb1736eea1322637f" FOREIGN KEY ("headId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_forms" ADD CONSTRAINT "FK_4fe0007e9e779f7de7b1d624b56" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_forms" ADD CONSTRAINT "FK_a50172b67328804b2af46bea8ed" FOREIGN KEY ("retirementId") REFERENCES "retirement_forms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_details" ADD CONSTRAINT "FK_c00ad2bc4eec151cc233919cac0" FOREIGN KEY ("advanceFormId") REFERENCES "advance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "retirement_forms" ADD CONSTRAINT "FK_b375f3ca9c7fc7949f834ede88a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_details" ADD CONSTRAINT "FK_874cca354cf9b356ae25f639108" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b" FOREIGN KEY ("advanceApprovedId") REFERENCES "advance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4" FOREIGN KEY ("retirementApprovedId") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3" FOREIGN KEY ("retirementFormId") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_c22e0f62a8f3384f8f21410c6a3"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_e0bfbc4463e3cee690af2f3bad4"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_4b9ed7f73db97924c6cc430469b"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_3eec3dab3d9bfae510e24cf8d23"`);
        await queryRunner.query(`ALTER TABLE "expense_details" DROP CONSTRAINT "FK_874cca354cf9b356ae25f639108"`);
        await queryRunner.query(`ALTER TABLE "retirement_forms" DROP CONSTRAINT "FK_b375f3ca9c7fc7949f834ede88a"`);
        await queryRunner.query(`ALTER TABLE "advance_details" DROP CONSTRAINT "FK_c00ad2bc4eec151cc233919cac0"`);
        await queryRunner.query(`ALTER TABLE "advance_forms" DROP CONSTRAINT "FK_a50172b67328804b2af46bea8ed"`);
        await queryRunner.query(`ALTER TABLE "advance_forms" DROP CONSTRAINT "FK_4fe0007e9e779f7de7b1d624b56"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_67d7ca900aeb1736eea1322637f"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9a238cbdc411387b8a96cfa6a9a"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_7dfc8e5b4441db5ca69bb532a13"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f4a582b56f240c4c974fabc6dd1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3dcbd55983fcd698c9134c2f24b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_573707d34e5b3252f03b728b3f5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_554d853741f2083faaa5794d2ae"`);
        await queryRunner.query(`DROP TABLE "supporting_docs"`);
        await queryRunner.query(`DROP TABLE "approvals"`);
        await queryRunner.query(`DROP TYPE "public"."approvals_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approvals_type_enum"`);
        await queryRunner.query(`DROP TABLE "expense_details"`);
        await queryRunner.query(`DROP TYPE "public"."expense_details_product_enum"`);
        await queryRunner.query(`DROP TABLE "retirement_forms"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_nextapprovallevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_approvallevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_type_enum"`);
        await queryRunner.query(`DROP TABLE "advance_details"`);
        await queryRunner.query(`DROP TYPE "public"."advance_details_product_enum"`);
        await queryRunner.query(`DROP TABLE "advance_forms"`);
        await queryRunner.query(`DROP TYPE "public"."advance_forms_nextapprovallevel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advance_forms_approvallevel_enum"`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
