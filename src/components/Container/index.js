import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 70px auto;

  h1 {
    display: flex;
    align-items: center;
    flex-direction: row;
    font-size: 20px;

    svg {
      margin-right: 10px;
    }
  }
`;

export default Container;
