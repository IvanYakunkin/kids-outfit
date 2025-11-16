import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1762115221612 implements MigrationInterface {
    name = 'Init1762115221612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "parentId" integer, CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characteristics" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_a64133a287a0f2d735da40fcd89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_characteristics" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "productId" integer, "characteristicId" integer, CONSTRAINT "PK_070b55fb83575ccca7fbdac7fc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" SERIAL NOT NULL, "imageName" character varying NOT NULL DEFAULT 'default.jpg', "productId" integer, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "sku" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, "care" character varying, "price" numeric(10,2) NOT NULL, "sold" integer NOT NULL DEFAULT '0', "discount" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sizes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_09ffc681886e25eb5ce3b319fab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_sizes" ("id" SERIAL NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "quantity" integer, "productId" integer, "sizeId" integer, CONSTRAINT "PK_19c3d021f81c5b1ff367bad6164" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_products" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "cartId" integer, "productId" integer, "sizeId" integer, CONSTRAINT "PK_3b12299e401712e78753a7b4fec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_products" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "price" numeric NOT NULL, "orderId" integer, "productSizeId" integer, "productId" integer, CONSTRAINT "PK_3e59f094c2dc3310d585216a813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "total" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "statusId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "middlename" character varying NOT NULL, "lastname" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "cartId" integer, CONSTRAINT "REL_89502c44bd22c06e714c31c1e9" UNIQUE ("cartId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_characteristics" ADD CONSTRAINT "FK_d3944bc62d589d4c834e83f2245" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_characteristics" ADD CONSTRAINT "FK_480be687efe7ef4c231a1da483e" FOREIGN KEY ("characteristicId") REFERENCES "characteristics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_sizes" ADD CONSTRAINT "FK_699f5366c2ebf46a77589bd225e" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_sizes" ADD CONSTRAINT "FK_ee25631fb0c1390f8e038989138" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_3ee3d2f230cd0cda8966be069b4" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_1931976f8c2fc77eb13a63c09ae" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_ce947d328c1c8ba05e948a4e0ee" FOREIGN KEY ("sizeId") REFERENCES "product_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_28b66449cf7cd76444378ad4e92" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_ed81591569108702b1451e2a206" FOREIGN KEY ("productSizeId") REFERENCES "product_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_27ca18f2453639a1cafb7404ece" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_37b50c6e3b13ecaf98e4306c2d7" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_89502c44bd22c06e714c31c1e93" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_89502c44bd22c06e714c31c1e93"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_37b50c6e3b13ecaf98e4306c2d7"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_27ca18f2453639a1cafb7404ece"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_ed81591569108702b1451e2a206"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_28b66449cf7cd76444378ad4e92"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_ce947d328c1c8ba05e948a4e0ee"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_1931976f8c2fc77eb13a63c09ae"`);
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_3ee3d2f230cd0cda8966be069b4"`);
        await queryRunner.query(`ALTER TABLE "product_sizes" DROP CONSTRAINT "FK_ee25631fb0c1390f8e038989138"`);
        await queryRunner.query(`ALTER TABLE "product_sizes" DROP CONSTRAINT "FK_699f5366c2ebf46a77589bd225e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`);
        await queryRunner.query(`ALTER TABLE "product_characteristics" DROP CONSTRAINT "FK_480be687efe7ef4c231a1da483e"`);
        await queryRunner.query(`ALTER TABLE "product_characteristics" DROP CONSTRAINT "FK_d3944bc62d589d4c834e83f2245"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "statuses"`);
        await queryRunner.query(`DROP TABLE "order_products"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_products"`);
        await queryRunner.query(`DROP TABLE "product_sizes"`);
        await queryRunner.query(`DROP TABLE "sizes"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP TABLE "product_characteristics"`);
        await queryRunner.query(`DROP TABLE "characteristics"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
