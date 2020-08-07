import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateRepositoryHistoric1591311881988
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tag_historics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tag_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'event_id',
            type: 'uuid',
          },
          {
            name: 'event_timestamp',
            type: 'timestamp',
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tag_historics',
      new TableForeignKey({
        name: 'tagHistoric',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'repository_tags',
      }),
    );

    await queryRunner.createForeignKey(
      'tag_historics',
      new TableForeignKey({
        name: 'userTagHistoric',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tag_historics', 'userTagHistoric');
    await queryRunner.dropForeignKey('tag_historics', 'tagHistoric');
    await queryRunner.dropTable('tag_historics');
  }
}
