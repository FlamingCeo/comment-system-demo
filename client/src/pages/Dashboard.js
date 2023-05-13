import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import Navbar from '../components/Navbar';
import Comments from '../components/Comments';

function Dashboard() {
  const [values, setValues] = useState({ comment: '' });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const { isLoading, showAlert, fetchComment, createComment,msg,isLoadingForTable } = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = values;
    if (comment) {
      createComment(values);
      setValues({ comment: '' });
    }
  };
  useEffect(() => {
    fetchComment();
  }, []);
  return (
    <>
      <Navbar />

      <Wrapper className='page'>
        {showAlert && !msg && (
          <div className='alert alert-danger'>
            there was an error, please try again
          </div>
        )}
        <form className='comment-form' onSubmit={handleSubmit}>
          {/* comment */}
          <FormRow
            type='name'
            name='comment'
            value={values.comment}
            handleChange={handleChange}
            horizontal
            placeholder='Comment'
          />
          <button type='submit' className='btn' disabled={isLoading}>
            {isLoading ? 'Adding New Comment...' : 'Add Comment'}
          </button>
        </form>
        {isLoadingForTable&& (
          <div className='alert alert-danger'>
            {msg}
          </div>
        )}
        <Comments />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  padding: 3rem 0;

  .comment-form {
    background: var(--white);
    display: grid;
    row-gap: 1rem;
    column-gap: 0.5rem;
    align-items: center;
    margin-bottom: 3rem;
    border-radius: var(--borderRadius);
    padding: 1.5rem;
    .form-input {
      padding: 0.75rem;
    }

    .form-input:focus {
      outline: 1px solid var(--primary-500);
    }
    .form-row {
      margin-bottom: 0;
    }
    .btn {
      padding: 0.75rem;
    }
    @media (min-width: 776px) {
      grid-template-columns: 1fr 1fr auto;
      .btn {
        height: 100%;
        padding: 0 2rem;
      }
      column-gap: 2rem;
    }
  }
  .alert {
    max-width: var(--max-width);
    margin-bottom: 1rem;
  }
`;

export default Dashboard;
