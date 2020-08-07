import React, { useState, useEffect } from 'react';
import { MdPublic } from 'react-icons/md';
import {
  formatDistanceToNowStrict,
  parseISO,
  formatDistanceStrict,
} from 'date-fns';

import List from '../../components/List';

import api from '../../services/api';

import { Container, Content, ListItem } from './styles';

interface Repository {
  id: string;
  title: string;
  private: boolean;
  updated_at: string;
  lastUpdate: string;
  user: {
    login: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    async function loadRepositories() {
      const response = await api.get('repositories/all');

      const newRepositories = response.data.map(
        (repository: Omit<Repository, 'lastUpdate'>) => ({
          ...repository,
          lastUpdate: formatDistanceStrict(
            parseISO(repository.updated_at),
            new Date(),
            {
              addSuffix: true,
            },
          ),
        }),
      );

      console.log(newRepositories);

      setRepositories(newRepositories);
    }
    loadRepositories();
  }, []);

  return (
    <Container>
      <Content>
        <List<Repository>
          items={repositories}
          keyExtractor={item => item.id}
          renderItem={({ item: repository }) => (
            <ListItem to={`${repository.user.login}/${repository.title}`}>
              <div>
                <strong>
                  {repository.user.login}/{repository.title}
                </strong>
                <span>updated {repository.lastUpdate}</span>
              </div>
              <span>
                <MdPublic size={24} />
                {repository.private ? 'PRIVATE' : 'PUBLIC'}
              </span>
            </ListItem>
          )}
        />
      </Content>
    </Container>
  );
};

export default Dashboard;
