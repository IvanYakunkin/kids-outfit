import { slugify } from 'transliteration';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1763325724325 implements MigrationInterface {
  name = 'Init1763325724325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "slug" character varying`,
    );
    const products: { id: number; name: string }[] = await queryRunner.query(
      `SELECT id, name FROM "products"`,
    );

    for (const product of products) {
      const slug = slugify(product.name).toLowerCase();
      await queryRunner.query(
        `UPDATE "products" SET "slug" = $1 WHERE id = $2`,
        [slug, product.id],
      );
    }

    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "product_sizes" ALTER COLUMN "quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sizes" ALTER COLUMN "quantity" SET DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_sizes" ALTER COLUMN "quantity" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sizes" ALTER COLUMN "quantity" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
  }
}
