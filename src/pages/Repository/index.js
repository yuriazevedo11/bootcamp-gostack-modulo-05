import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import api from '../../services/api';

import { Loading, Owner, IssueList, IssueFilter, Pagination } from './styles';
import Container from '../../components/Container';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    loading: true,
    repository: {},
    selectedFilter: 'all',
    filters: [
      { value: 'all', label: 'Todas' },
      { value: 'open', label: 'Abertas' },
      { value: 'closed', label: 'Fechadas' },
    ],
    issues: [],
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { selectedFilter } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          state: selectedFilter,
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

  handleFilter = async e => {
    await this.setState({ selectedFilter: e.target.value, page: 1 });
    this.filterIssues();
  };

  handlePage = async type => {
    const { page } = this.state;
    const newPage = type === 'prev' ? page - 1 : page + 1;

    await this.setState({ page: newPage });
    this.filterIssues();
  };

  filterIssues = async () => {
    const { match } = this.props;
    const { selectedFilter, page } = this.state;

    this.setState({ loading: true });

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await api.get(`repos/${repoName}/issues`, {
      params: {
        state: selectedFilter,
        per_page: 5,
        page,
      },
    });

    this.setState({
      loading: false,
      issues: issues.data,
    });
  };

  render() {
    const {
      page,
      loading,
      repository,
      issues,
      filters,
      selectedFilter,
    } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueFilter>
          <span>Estado: </span>
          <select onChange={this.handleFilter} defaultValue={selectedFilter}>
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </IssueFilter>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination>
          <button
            type="button"
            onClick={() => this.handlePage('prev')}
            disabled={page < 2}
          >
            <FaArrowLeft color="#7159c1" size={24} />
          </button>
          <button type="button" onClick={() => this.handlePage('next')}>
            <FaArrowRight color="#7159c1" size={24} />
          </button>
        </Pagination>
      </Container>
    );
  }
}
