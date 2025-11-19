import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1763584099642 implements MigrationInterface {
    name = 'Init1763584099642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "tokenHash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "expiresAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "ip" character varying`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "userAgent" character varying`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_c25bc63d248ca90e8dcc1d92d0" ON "refresh_tokens" ("tokenHash") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25bc63d248ca90e8dcc1d92d0"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "userAgent"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "ip"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "tokenHash"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
