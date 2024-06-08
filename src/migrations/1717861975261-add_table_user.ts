import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableUser1717861975261 implements MigrationInterface {
    name = 'AddTableUser1717861975261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('M', 'F')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying, "gender" "public"."users_gender_enum" NOT NULL, "bod" TIMESTAMP NOT NULL, "bio" character varying, "is_subscribed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    }

}
