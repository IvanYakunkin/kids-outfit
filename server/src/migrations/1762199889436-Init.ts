import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1762199889436 implements MigrationInterface {
    name = 'Init1762199889436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_89502c44bd22c06e714c31c1e93"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "REL_89502c44bd22c06e714c31c1e9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "quantity" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "productSizeId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku")`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_accc73f75726f0a6eaf8b687899" FOREIGN KEY ("productSizeId") REFERENCES "product_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_accc73f75726f0a6eaf8b687899"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "productSizeId"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cartId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "REL_89502c44bd22c06e714c31c1e9" UNIQUE ("cartId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_89502c44bd22c06e714c31c1e93" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
