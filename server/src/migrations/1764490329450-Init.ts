import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1764490329450 implements MigrationInterface {
    name = 'Init1764490329450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "middlename" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "middlename" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD "price" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
