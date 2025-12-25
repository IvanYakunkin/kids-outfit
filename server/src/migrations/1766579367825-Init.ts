import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766579367825 implements MigrationInterface {
    name = 'Init1766579367825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "daily_statistics" ("id" SERIAL NOT NULL, "date" date NOT NULL, "uniqueVisits" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_bd281607cfef15ee392b1ac77cf" UNIQUE ("date"), CONSTRAINT "PK_2e439eb49fe85f13821ed3549ff" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "daily_statistics"`);
    }

}
