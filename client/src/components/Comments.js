import { useGlobalContext } from '../context/appContext';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash ,FaThumbsUp,FaThumbsDown} from 'react-icons/fa';
import moment from 'moment';
import CommentColumns from './CommentColumns';
import ReactPaginate from 'react-paginate';

const Comments = () => {
  const { comments,isLoadingForTable, isLoading,
     deleteComment,likeComment,dislikeComment, 
     userId,
     page,
     handlePageClick,
     handleFilter,
     status,
     filter,
     fetchComment
    } = useGlobalContext();
  if (isLoading) {
    //  return <div className='loading'></div>;
  }

  if (comments.length < 1) {
    return (
      <EmptyContainer>
        <h5>
          Currently, you have no <span>COMMENTS </span>
          to display
        </h5>
      </EmptyContainer>
    );
  }

  return (
    <>
    
    <div className = "row m-1">
    <div className = " col-5">
    <select name="filter" onChange ={handleFilter} className = "form-select"value = {filter}>
      <option value="createdAt">Comment</option>
      <option value="dislikes">Dislikes</option>
      <option value="likes">Likes</option>
    </select> 

    </div>
    <div className = "col-5">
    <select name="status" onChange ={handleFilter}className = "form-select" value={status}>
      <option value="-1">Ascending</option>
      <option value="1">Descending</option>
    </select>
    </div>
    <a className = "btn col-1" onClick = {fetchComment}>Submit</a> 

    </div>

      <CommentColumns />
      <Container>
        {comments.map((item) => {
          const { _id: id, comment, likes, dislikes, createdAt } = item;
          let date = moment(createdAt);
          date = date.format('MMMM Do, YYYY');
          return (
            <article key={id} className='comment-section'>
              <span className='comment'>
                {comment}
                <button
                    className='thumb-btn'
                    type='button'
                    onClick={() => likeComment(id)}
                  >
                    <FaThumbsUp />
                    {(likes)}
                  </button>
                  <button
                    className='thumb-btn'
                    type='button'
                    onClick={() => dislikeComment(id)}
                  >
                    <FaThumbsDown />
                    {(dislikes)}
                  </button>
              </span>
              <span className='date'>{date}</span>
              {userId==item.userId &&
                <div className='action-div'>
                  <Link to={`/edit/${id}`} className='edit-btn' type='button'>
                    <FaEdit />
                  </Link>
                  <button
                    className=' delete-btn'
                    type='button'
                    onClick={() => deleteComment(id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              }

            </article>
          );
        })}
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={10}
            marginPagesDisplayed={2}
            pageCount={page.pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
      </Container>
    </>
  );
};
const EmptyContainer = styled.section`
  text-align: center;
  h5 {
    text-transform: none;
  }
  span {
    color: var(--primary-500);
  }
`;
const Container = styled.section`
  .comment-section {
    background: var(--white);
    border-radius: var(--borderRadius);
    margin-bottom: 2rem;
    display: grid;
    padding: 2rem 0;
    justify-content: center;
    text-align: center;
  }
  .icon {
    background: var(--primary-500);
    display: block;
    border-radius: var(--borderRadius);
    color: var(--white);
    font-size: 2rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  span {
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
  }
  .position {
    font-weight: 600;
  }
  .date {
    color: var(--grey-500);
  }
  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    margin: 0.75rem auto;
    width: 100px;
  }
  .edit-btn {
    color: var(--green-dark);
    border-color: transparent;
    background: transparent !important;
    outline: transparent;
    border-radius: var(--borderRadius);
    cursor: pointer;
    display: inline-block;
    appearance: none;
  }
  .thumb-btn{
    color:  var(--grey-500);
    border-color: transparent;
    border-radius: var(--borderRadius);
    cursor: pointer;
    background: transparent;
  }

  .thumb-active-btn{
    color:  var(--primary-500);
  }
  .delete-btn {
    color: var(--red-dark);
    border-color: transparent;
    border-radius: var(--borderRadius);
    cursor: pointer;
    background: transparent;
  }
  .edit-btn,
  .delete-btn ,
  .up-btn{
    font-size: 1rem;
    line-height: 1.15;
    margin-bottom: -3px;
  }


  .action-div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr;
    .icon {
      display: none;
    }
    background: var(--white);
    border-bottom-left-radius: var(--borderRadius);
    border-bottom-right-radius: var(--borderRadius);

    .comment-section {
      border-radius: 0;
      justify-content: left;
      text-align: left;
      border-bottom: 1px solid var(--grey-200);
      grid-template-columns: 1fr 1fr 150px 100px 100px;
      align-items: center;
      padding: 1rem 1.5rem;
      column-gap: 1rem;
      margin-bottom: 0;
    }
    .comment-section:last-child {
      border-bottom: none;
    }
    span {
      font-size: var(--small-text);
    }
    .comment,
    .position {
      font-weight: 400;
      text-transform: capitalize;
    }
    .date {
      font-weight: 400;
      color: var(--grey-500);
    }

    .status {
      font-size: var(--smallText);
    }

    .action-div {
      margin-left: 1rem;
      justify-content: left;
    }


  }
`;
const setStatusColor = (status) => {
  if (status === 'interview') return '#0f5132';
  if (status === 'declined') return '#842029';
  return '#927238';
};
const setStatusBackground = (status) => {
  if (status === 'interview') return '#d1e7dd';
  if (status === 'declined') return '#f8d7da';
  return '#f7f3d7';
};

const StatusContainer = styled.span`
  border-radius: var(--borderRadius);
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
  text-align: center;
  color: ${(props) => setStatusColor(props.status)};
  background: ${(props) => setStatusBackground(props.status)};
`;
export default Comments;
