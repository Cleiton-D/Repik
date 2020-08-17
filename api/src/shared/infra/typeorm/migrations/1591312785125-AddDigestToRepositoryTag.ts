import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDigestToRepository1591312785125
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'repository_tags',
      new TableColumn({
        name: 'digest',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('repository_tags', 'digest');
  }
}
