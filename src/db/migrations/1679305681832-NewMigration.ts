import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1679305681832 implements MigrationInterface {
    name = 'NewMigration1679305681832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`unit\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`headId\` int NULL, \`departmentId\` int NULL, UNIQUE INDEX \`REL_3fb47d0da0b6070496f028bf89\` (\`headId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`department\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`headId\` int NULL, UNIQUE INDEX \`REL_704562fff92144d2bc2ade1016\` (\`headId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`advance_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product\` enum ('accommodation', 'per diem', 'taxi') NOT NULL, \`rate\` int NOT NULL, \`amount\` int NOT NULL, \`number\` int NOT NULL, \`remark\` varchar(255) NOT NULL, \`advanceFormId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expense_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product\` enum ('accommodation', 'per diem', 'taxi') NOT NULL, \`rate\` int NOT NULL, \`amount\` int NOT NULL, \`number\` int NOT NULL, \`remark\` varchar(255) NOT NULL, \`retirementFormId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`approvals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`approvedOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`type\` enum ('advance', 'retirement') NOT NULL, \`level\` int NOT NULL, \`remark\` varchar(255) NOT NULL, \`approvedById\` int NULL, \`advanceApprovedId\` int NULL, \`retirementApprovedId\` int NULL, UNIQUE INDEX \`REL_3eec3dab3d9bfae510e24cf8d2\` (\`approvedById\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supporting_docs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`documentDescription\` varchar(255) NOT NULL, \`file\` longblob NULL, \`retirementFormId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`retirement_form\` (\`id\` int NOT NULL AUTO_INCREMENT, \`purpose\` varchar(255) NOT NULL, \`depatureDate\` datetime NOT NULL, \`returnDate\` datetime NOT NULL, \`type\` enum ('cash', 'advance') NOT NULL, \`preApprovalRemarkByFinance\` varchar(255) NULL, \`approvalLevel\` int NOT NULL, \`nextApprovalLevel\` int NOT NULL, \`delegatedByPD\` tinyint NOT NULL DEFAULT 0, \`pushedToFinance\` tinyint NOT NULL DEFAULT 0, \`approvedByFin\` tinyint NOT NULL DEFAULT 0, \`rejected\` tinyint NOT NULL DEFAULT 0, \`remarkByFin\` varchar(255) NOT NULL, \`balanceToStaff\` int NOT NULL, \`balanceToOrganization\` int NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`advance_form\` (\`id\` int NOT NULL AUTO_INCREMENT, \`purpose\` varchar(255) NOT NULL, \`depatureDate\` datetime NOT NULL, \`returnDate\` datetime NOT NULL, \`origination\` varchar(255) NOT NULL, \`destination\` varchar(255) NOT NULL, \`preApprovalRemarkByFinance\` varchar(255) NULL, \`approvalLevel\` int NOT NULL, \`nextApprovalLevel\` int NOT NULL, \`delegatedByPD\` tinyint NOT NULL DEFAULT 0, \`pushedToFinance\` tinyint NOT NULL DEFAULT 0, \`approvedByFin\` tinyint NOT NULL DEFAULT 0, \`rejected\` tinyint NOT NULL DEFAULT 0, \`remarkByFin\` varchar(255) NOT NULL, \`totalAmount\` int NOT NULL, \`userId\` int NULL, \`retirementId\` int NULL, UNIQUE INDEX \`REL_560a468e3547dd7b4e56681676\` (\`retirementId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`verificationToken\` varchar(255) NULL, \`verified\` datetime NULL, \`supervisorId\` int NULL, \`unitId\` int NULL, \`departmentId\` int NULL, \`role\` enum ('0', '1', '2', '3', '4', '5', '6', '7') NOT NULL DEFAULT '0', \`passwordToken\` varchar(255) NULL, \`passwordTokenExpiration\` datetime NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`unit\` ADD CONSTRAINT \`FK_c93ddd4d9643186a0db8c26234c\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`unit\` ADD CONSTRAINT \`FK_3fb47d0da0b6070496f028bf896\` FOREIGN KEY (\`headId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD CONSTRAINT \`FK_704562fff92144d2bc2ade1016a\` FOREIGN KEY (\`headId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`advance_details\` ADD CONSTRAINT \`FK_c00ad2bc4eec151cc233919cac0\` FOREIGN KEY (\`advanceFormId\`) REFERENCES \`advance_form\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense_details\` ADD CONSTRAINT \`FK_874cca354cf9b356ae25f639108\` FOREIGN KEY (\`retirementFormId\`) REFERENCES \`retirement_form\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`approvals\` ADD CONSTRAINT \`FK_3eec3dab3d9bfae510e24cf8d23\` FOREIGN KEY (\`approvedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`approvals\` ADD CONSTRAINT \`FK_4b9ed7f73db97924c6cc430469b\` FOREIGN KEY (\`advanceApprovedId\`) REFERENCES \`advance_form\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`approvals\` ADD CONSTRAINT \`FK_e0bfbc4463e3cee690af2f3bad4\` FOREIGN KEY (\`retirementApprovedId\`) REFERENCES \`retirement_form\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supporting_docs\` ADD CONSTRAINT \`FK_c22e0f62a8f3384f8f21410c6a3\` FOREIGN KEY (\`retirementFormId\`) REFERENCES \`retirement_form\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`retirement_form\` ADD CONSTRAINT \`FK_12c1f9140c6a078a7f001ae91ae\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`advance_form\` ADD CONSTRAINT \`FK_b6420a228e3e9769e040889cf17\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`advance_form\` ADD CONSTRAINT \`FK_560a468e3547dd7b4e566816764\` FOREIGN KEY (\`retirementId\`) REFERENCES \`retirement_form\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_3d6915a33798152a079997cad28\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_856a1f0347b672d3b8bb4693bd8\` FOREIGN KEY (\`unitId\`) REFERENCES \`unit\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_5eee61d80509271c4bd366995ec\` FOREIGN KEY (\`supervisorId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_5eee61d80509271c4bd366995ec\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_856a1f0347b672d3b8bb4693bd8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_3d6915a33798152a079997cad28\``);
        await queryRunner.query(`ALTER TABLE \`advance_form\` DROP FOREIGN KEY \`FK_560a468e3547dd7b4e566816764\``);
        await queryRunner.query(`ALTER TABLE \`advance_form\` DROP FOREIGN KEY \`FK_b6420a228e3e9769e040889cf17\``);
        await queryRunner.query(`ALTER TABLE \`retirement_form\` DROP FOREIGN KEY \`FK_12c1f9140c6a078a7f001ae91ae\``);
        await queryRunner.query(`ALTER TABLE \`supporting_docs\` DROP FOREIGN KEY \`FK_c22e0f62a8f3384f8f21410c6a3\``);
        await queryRunner.query(`ALTER TABLE \`approvals\` DROP FOREIGN KEY \`FK_e0bfbc4463e3cee690af2f3bad4\``);
        await queryRunner.query(`ALTER TABLE \`approvals\` DROP FOREIGN KEY \`FK_4b9ed7f73db97924c6cc430469b\``);
        await queryRunner.query(`ALTER TABLE \`approvals\` DROP FOREIGN KEY \`FK_3eec3dab3d9bfae510e24cf8d23\``);
        await queryRunner.query(`ALTER TABLE \`expense_details\` DROP FOREIGN KEY \`FK_874cca354cf9b356ae25f639108\``);
        await queryRunner.query(`ALTER TABLE \`advance_details\` DROP FOREIGN KEY \`FK_c00ad2bc4eec151cc233919cac0\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP FOREIGN KEY \`FK_704562fff92144d2bc2ade1016a\``);
        await queryRunner.query(`ALTER TABLE \`unit\` DROP FOREIGN KEY \`FK_3fb47d0da0b6070496f028bf896\``);
        await queryRunner.query(`ALTER TABLE \`unit\` DROP FOREIGN KEY \`FK_c93ddd4d9643186a0db8c26234c\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_560a468e3547dd7b4e56681676\` ON \`advance_form\``);
        await queryRunner.query(`DROP TABLE \`advance_form\``);
        await queryRunner.query(`DROP TABLE \`retirement_form\``);
        await queryRunner.query(`DROP TABLE \`supporting_docs\``);
        await queryRunner.query(`DROP INDEX \`REL_3eec3dab3d9bfae510e24cf8d2\` ON \`approvals\``);
        await queryRunner.query(`DROP TABLE \`approvals\``);
        await queryRunner.query(`DROP TABLE \`expense_details\``);
        await queryRunner.query(`DROP TABLE \`advance_details\``);
        await queryRunner.query(`DROP INDEX \`REL_704562fff92144d2bc2ade1016\` ON \`department\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP INDEX \`REL_3fb47d0da0b6070496f028bf89\` ON \`unit\``);
        await queryRunner.query(`DROP TABLE \`unit\``);
    }

}
