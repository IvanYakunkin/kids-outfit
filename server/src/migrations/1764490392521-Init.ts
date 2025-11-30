import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1764490392521 implements MigrationInterface {
    name = 'Init1764490392521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" SET DEFAULT '0'`);
    }

}
