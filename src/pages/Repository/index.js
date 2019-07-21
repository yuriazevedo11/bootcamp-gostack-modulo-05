import React, { Component } from 'react';

import api from '../../services/api';

// import { Container } from './styles';

export default class Repository extends Component {
  state = {
    loading: true,
    repository: {},
    issues: [],
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
    });
  }

  render() {
    const { loading, repository, issues } = this.state;

    return <h1>Repository: </h1>;
  }
}
