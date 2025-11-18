import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1763497280939 implements MigrationInterface {
    name = 'Init1763497280939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "imageName"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "publicId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "imageName" character varying NOT NULL DEFAULT 'default.jpg'`);
    }

}
