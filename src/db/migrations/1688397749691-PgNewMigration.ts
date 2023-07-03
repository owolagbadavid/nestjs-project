import { MigrationInterface, QueryRunner } from "typeorm";

export class PgNewMigration1688397749691 implements MigrationInterface {
    name = 'PgNewMigration1688397749691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "verification_token" character varying, "verified" TIMESTAMP, "supervisor_id" integer, "unit_id" integer, "department_id" integer, "role" "public"."users_role_enum" NOT NULL DEFAULT '0', "password_token" character varying, "password_token_expiration" TIMESTAMP, "delegated" boolean NOT NULL DEFAULT false, "delegate_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_6f219d5b62572903a6dd36f3e6" UNIQUE ("delegate_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "head_id" integer, CONSTRAINT "REL_8a78ebfafe22243a64d0b91239" UNIQUE ("head_id"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "head_id" integer, "department_id" integer, CONSTRAINT "REL_c71b25a631eee479e02bcbf4b7" UNIQUE ("head_id"), CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supporting_docs" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "encoding" character varying NOT NULL, "document_description" character varying NOT NULL, "file" bytea, "retirement_form_id" integer, "advance_form_id" integer, CONSTRAINT "REL_512c970b31d500d5c66627b762" UNIQUE ("advance_form_id"), CONSTRAINT "PK_5b105234d8a0f6b75eb8c66773a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."advance_forms_approval_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."advance_forms_next_approval_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."advance_forms_currency_scope_enum" AS ENUM('local', 'international')`);
        await queryRunner.query(`CREATE TABLE "advance_forms" ("id" SERIAL NOT NULL, "user_id" integer, "purpose" character varying NOT NULL, "departure_date" TIMESTAMP NOT NULL, "return_date" TIMESTAMP NOT NULL, "origination" character varying NOT NULL, "destination" character varying NOT NULL, "pre_approval_remark_by_fin" character varying, "finance_go_ahead" boolean, "approval_level" "public"."advance_forms_approval_level_enum" NOT NULL, "next_approval_level" "public"."advance_forms_next_approval_level_enum", "pushed_to_finance" boolean NOT NULL DEFAULT false, "approved_by_fin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "rejection_reason" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "remark_by_fin" character varying, "retirement_id" integer, "total_amount" numeric NOT NULL, "disbursed" boolean NOT NULL DEFAULT false, "currency_scope" "public"."advance_forms_currency_scope_enum" NOT NULL DEFAULT 'local', CONSTRAINT "REL_32c1e1337a24fd6b1f3c69cf3a" UNIQUE ("retirement_id"), CONSTRAINT "PK_86d8c596266c93e0312628098af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advance_details" ("id" SERIAL NOT NULL, "product" character varying NOT NULL, "rate" numeric NOT NULL, "amount" numeric NOT NULL, "number" numeric NOT NULL, "remark" character varying, "advance_form_id" integer, CONSTRAINT "PK_b6f7fbfaff1472afed14035e5a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_type_enum" AS ENUM('cash', 'advance')`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_approval_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_next_approval_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TYPE "public"."retirement_forms_currency_scope_enum" AS ENUM('local', 'international')`);
        await queryRunner.query(`CREATE TABLE "retirement_forms" ("id" SERIAL NOT NULL, "user_id" integer, "purpose" character varying NOT NULL, "departure_date" TIMESTAMP NOT NULL, "return_date" TIMESTAMP NOT NULL, "type" "public"."retirement_forms_type_enum" NOT NULL, "pre_approval_remark_by_fin" character varying, "finance_go_ahead" boolean, "approval_level" "public"."retirement_forms_approval_level_enum" NOT NULL, "next_approval_level" "public"."retirement_forms_next_approval_level_enum", "pushed_to_finance" boolean NOT NULL DEFAULT false, "approved_by_fin" boolean NOT NULL DEFAULT false, "rejected" boolean NOT NULL DEFAULT false, "rejection_reason" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "remark_by_fin" character varying, "total_amount" numeric NOT NULL, "balance_to_staff" numeric NOT NULL, "balance_to_organization" numeric NOT NULL, "disbursed" boolean NOT NULL DEFAULT false, "currency_scope" "public"."retirement_forms_currency_scope_enum" NOT NULL DEFAULT 'local', CONSTRAINT "PK_d33b40a59d6abb6191842950e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_details" ("id" SERIAL NOT NULL, "product" character varying NOT NULL, "rate" numeric NOT NULL, "amount" numeric NOT NULL, "number" numeric NOT NULL, "remark" character varying, "retirement_form_id" integer, CONSTRAINT "PK_8012987d153b25cc960f171b920" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_type_enum" AS ENUM('advance', 'retirement')`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "approvals" ("id" SERIAL NOT NULL, "approvedOn" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."approvals_type_enum" NOT NULL, "level" "public"."approvals_level_enum" NOT NULL, "remark" character varying NOT NULL, "approved_by_user_id" integer, "advance_form_id" integer, "retirement_form_id" integer, CONSTRAINT "PK_690417aaefa84d18b1a59e2a499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile_picture" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "encoding" character varying NOT NULL, "file" bytea, "user_id" integer, CONSTRAINT "REL_a1b9908bf499eee3013bc419b8" UNIQUE ("user_id"), CONSTRAINT "PK_bff7cf5dab19806d713071f0f84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0921d1972cf861d568f5271cd85" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b94ecc6be926a5d23aa7791ec8a" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9a1bf4d0601de6693fc9b31d7f5" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f219d5b62572903a6dd36f3e6e" FOREIGN KEY ("delegate_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_8a78ebfafe22243a64d0b91239c" FOREIGN KEY ("head_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_2ad3e7fac1ea8a6997b11331c12" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_c71b25a631eee479e02bcbf4b7d" FOREIGN KEY ("head_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_f601aa1ecd49cc4e62e95d3ec95" FOREIGN KEY ("retirement_form_id") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" ADD CONSTRAINT "FK_512c970b31d500d5c66627b762e" FOREIGN KEY ("advance_form_id") REFERENCES "advance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advance_forms" ADD CONSTRAINT "FK_3d2819f0b3894e16a1dc1da0599" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_forms" ADD CONSTRAINT "FK_32c1e1337a24fd6b1f3c69cf3a6" FOREIGN KEY ("retirement_id") REFERENCES "retirement_forms"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advance_details" ADD CONSTRAINT "FK_79e7839467b82ce4e08f6baa9b6" FOREIGN KEY ("advance_form_id") REFERENCES "advance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "retirement_forms" ADD CONSTRAINT "FK_b788d86a32610efba1a666ac397" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_details" ADD CONSTRAINT "FK_7c2b78112bcdc360d09f95e72e5" FOREIGN KEY ("retirement_form_id") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_b30070cbbf31e889a650abd21b7" FOREIGN KEY ("approved_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_0327cf26552bf6ec1e23fecb505" FOREIGN KEY ("advance_form_id") REFERENCES "advance_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_06ff31c62c6aedb8bb906ba52ad" FOREIGN KEY ("retirement_form_id") REFERENCES "retirement_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "profile_picture" ADD CONSTRAINT "FK_a1b9908bf499eee3013bc419b8d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_picture" DROP CONSTRAINT "FK_a1b9908bf499eee3013bc419b8d"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_06ff31c62c6aedb8bb906ba52ad"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_0327cf26552bf6ec1e23fecb505"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_b30070cbbf31e889a650abd21b7"`);
        await queryRunner.query(`ALTER TABLE "expense_details" DROP CONSTRAINT "FK_7c2b78112bcdc360d09f95e72e5"`);
        await queryRunner.query(`ALTER TABLE "retirement_forms" DROP CONSTRAINT "FK_b788d86a32610efba1a666ac397"`);
        await queryRunner.query(`ALTER TABLE "advance_details" DROP CONSTRAINT "FK_79e7839467b82ce4e08f6baa9b6"`);
        await queryRunner.query(`ALTER TABLE "advance_forms" DROP CONSTRAINT "FK_32c1e1337a24fd6b1f3c69cf3a6"`);
        await queryRunner.query(`ALTER TABLE "advance_forms" DROP CONSTRAINT "FK_3d2819f0b3894e16a1dc1da0599"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_512c970b31d500d5c66627b762e"`);
        await queryRunner.query(`ALTER TABLE "supporting_docs" DROP CONSTRAINT "FK_f601aa1ecd49cc4e62e95d3ec95"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_c71b25a631eee479e02bcbf4b7d"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_2ad3e7fac1ea8a6997b11331c12"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_8a78ebfafe22243a64d0b91239c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f219d5b62572903a6dd36f3e6e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9a1bf4d0601de6693fc9b31d7f5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b94ecc6be926a5d23aa7791ec8a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0921d1972cf861d568f5271cd85"`);
        await queryRunner.query(`DROP TABLE "profile_picture"`);
        await queryRunner.query(`DROP TABLE "approvals"`);
        await queryRunner.query(`DROP TYPE "public"."approvals_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approvals_type_enum"`);
        await queryRunner.query(`DROP TABLE "expense_details"`);
        await queryRunner.query(`DROP TABLE "retirement_forms"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_currency_scope_enum"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_next_approval_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_approval_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."retirement_forms_type_enum"`);
        await queryRunner.query(`DROP TABLE "advance_details"`);
        await queryRunner.query(`DROP TABLE "advance_forms"`);
        await queryRunner.query(`DROP TYPE "public"."advance_forms_currency_scope_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advance_forms_next_approval_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advance_forms_approval_level_enum"`);
        await queryRunner.query(`DROP TABLE "supporting_docs"`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
