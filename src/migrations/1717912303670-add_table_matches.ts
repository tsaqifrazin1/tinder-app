import { MigrationInterface, QueryRunner } from "typeorm";

export class addTableMatches1717912303670 implements MigrationInterface {
    name = 'addTableMatches1717912303670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_one_id" integer NOT NULL, "user_two_id" integer NOT NULL, "matched_at" date NOT NULL DEFAULT now(), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_740d8d336b3d8512271e901739" ON "matches" ("user_one_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_03ce39843fe24c9a40949f1ba3" ON "matches" ("user_two_id") `);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_740d8d336b3d8512271e9017395" FOREIGN KEY ("user_one_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_03ce39843fe24c9a40949f1ba31" FOREIGN KEY ("user_two_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_03ce39843fe24c9a40949f1ba31"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_740d8d336b3d8512271e9017395"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03ce39843fe24c9a40949f1ba3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_740d8d336b3d8512271e901739"`);
        await queryRunner.query(`DROP TABLE "matches"`);
    }

}
