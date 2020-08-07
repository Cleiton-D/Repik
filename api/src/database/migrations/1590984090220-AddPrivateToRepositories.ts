import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddPrivateToRepository1590984090220
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'repositories',
      new TableColumn({
        name: 'private',
        type: 'boolean',
        default: 'false',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('repositories', 'private');
  }
}
