import { MigrationInterface, QueryRunner } from "typeorm";

export class addTableUserPreferences1717876825686 implements MigrationInterface {
    name = 'addTableUserPreferences1717876825686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_preferences_preffered_gender_enum" AS ENUM('M', 'F', 'BOTH')`);
        await queryRunner.query(`CREATE TABLE "user_preferences" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "age_min" integer NOT NULL, "age_max" integer NOT NULL, "preffered_gender" "public"."user_preferences_preffered_gender_enum" NOT NULL, "user_id" integer, CONSTRAINT "REL_458057fa75b66e68a275647da2" UNIQUE ("user_id"), CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`DROP TABLE "user_preferences"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferences_preffered_gender_enum"`);
    }

}
