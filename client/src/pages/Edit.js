import { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import Navbar from '../components/Navbar';
function Update() {
  const { id } = useParams();
  const {
    isLoading,
    editItem,
    fetchSingleComment,
    singleCommentError: error,
    user,
    editComment,
    editComplete,
  } = useGlobalContext();

  const [values, setValues] = useState({
    comment: '',
  });

  useEffect(() => {
    fetchSingleComment(id);
  }, [id]);

  useEffect(() => {
    if (editItem) {
      const { comment } = editItem;
      setValues({ comment });
    }
  }, [editItem]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = values;
    if (comment) {
      editComment(id, { comment });
    }
  };
  if (isLoading && !editItem) {
    return <div className='loading'></div>;
  }

  if (!editItem || error) {
    return (
      <>
        {!user && <Redirect to='/' />}
        <ErrorContainer className='page'>
          <h5>There was an error, please double check your comment ID</h5>

          <Link to='/dashboard' className='btn'>
            dasboard
          </Link>
        </ErrorContainer>
      </>
    );
  }
  return (
    <>
      {!user && <Redirect to='/' />}
      <Navbar />
      <Container className='page'>
        <header>
          <Link to='/dashboard' className='btn btn-block back-home'>
            back home
          </Link>
        </header>
        <form className='form' onSubmit={handleSubmit}>
          <p>{editComplete && 'Success! Edit Complete'}</p>
          <h4>Update Comment</h4>
          {/* company */}
          <div className='form-container'>
            <FormRow
              type='name'
              name='comment'
              value={values.comment}
              handleChange={handleChange}
            />
            <button
              type='submit'
              className='btn btn-block submit-btn'
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </Container>
    </>
  );
}
const ErrorContainer = styled.section`
  text-align: center;
  padding-top: 6rem; ;
`;

const Container = styled.section`
  header {
    margin-top: 4rem;
  }
  .form {
    max-width: var(--max-width);
    margin-top: 2rem;
  }
  .form h4 {
    text-align: center;
  }
  .form > p {
    text-align: center;
    color: var(--green-dark);
    letter-spacing: var(--letterSpacing);
    margin-top: 0;
  }
  .status {
    background: var(--grey-100);
    border-radius: var(--borderRadius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .back-home {
    text-align: center;
    display: block;
    width: 100%;
    font-size: 1rem;
    line-height: 1.15;
    background: var(--black);
  }
  .back-home:hover {
    background: var(--grey-500);
  }
  @media (min-width: 768px) {
    .back-home {
      width: 200px;
    }
    .form h4 {
      text-align: left;
    }
    .form-container {
      display: grid;
      grid-template-columns: 1fr 1fr 100px auto;
      column-gap: 0.5rem;
      align-items: center;
    }

    .form > p {
      text-align: left;
    }
    .form-row {
      margin-bottom: 0;
    }
    .submit-btn {
      align-self: end;
    }
  }
`;
export default Update;
