import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableSwipes1717882253655 implements MigrationInterface {
  name = 'addTableSwipes1717882253655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."swipes_action_enum" AS ENUM('LEFT', 'RIGHT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "swipes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "swiped_id" integer NOT NULL, "swiper_id" integer NOT NULL, "action" "public"."swipes_action_enum" NOT NULL, "swiped_at" date NOT NULL DEFAULT now(), CONSTRAINT "PK_bb38af5831e2c084a78e3622ff6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a8698aa702124c144b4283f56" ON "swipes" ("swiped_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd8c459dd78c47b0bdcd829929" ON "swipes" ("swiper_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7bf9f2ba1e38c4cd0998df4582" ON "swipes" ("swiped_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_950639109b0f226c41a486396e" ON "swipes" ("swiped_id", "swiper_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "swipes" ADD CONSTRAINT "FK_5a8698aa702124c144b4283f564" FOREIGN KEY ("swiped_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipes" ADD CONSTRAINT "FK_fd8c459dd78c47b0bdcd829929e" FOREIGN KEY ("swiper_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swipes" DROP CONSTRAINT "FK_fd8c459dd78c47b0bdcd829929e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipes" DROP CONSTRAINT "FK_5a8698aa702124c144b4283f564"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_950639109b0f226c41a486396e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7bf9f2ba1e38c4cd0998df4582"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd8c459dd78c47b0bdcd829929"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a8698aa702124c144b4283f56"`,
    );
    await queryRunner.query(`DROP TABLE "swipes"`);
    await queryRunner.query(`DROP TYPE "public"."swipes_action_enum"`);
  }
}
