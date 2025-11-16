import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1762117855885 implements MigrationInterface {
    name = 'Init1762117855885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")`);
    }

}
