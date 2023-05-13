import axios from 'axios'
import '../axios'
import React, { useContext, useEffect, useReducer } from 'react'
import {
  SET_LOADING,
  SET_LOADING_FOR_TABLE,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGOUT_USER,
  SET_USER,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_ERROR,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_ERROR,
  DELETE_COMMENT_ERROR,
  DELETE_COMMENT_SUCCESS,
  FETCH_SINGLE_COMMENT_SUCCESS,
  FETCH_SINGLE_COMMENT_ERROR,
  EDIT_COMMENT_SUCCESS,
  EDIT_COMMENT_ERROR,
  PAGE_CLICK,
  SET_FILTER
} from './actions'
import reducer from './reducer'

const initialState = {
  user: null,
  isLoading: false,
  isLoadingForTable: false,
  comments: [],
  showAlert: false,
  editItem: null,
  singleCommentError: false,
  editComplete: false,
  filter: "createdAt",
  status: "-1",
  page: {
    currentPage: 1,
    pageCount: 1,

  },
  showMsg:false
}
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setLoading = () => {
    dispatch({ type: SET_LOADING })
  }

  const setLoadingForTable = () => {
    dispatch({ type: SET_LOADING_FOR_TABLE })
  }
  // register
  const register = async (userInput) => {
    setLoading()
    try {
      const { data } = await axios.post(`/auth/register`, {
        ...userInput,
      })
      var userItem = {
        name: data.user.name,
        id: data.user["_id"]
      }

      dispatch({ type: REGISTER_USER_SUCCESS, payload: userItem })
      localStorage.setItem(
        'user',
        JSON.stringify({ user: userItem, token: data.token })
      )
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR })
    }
  }

  // login
  const login = async (userInput) => {
    setLoading()
    try {
      const { data } = await axios.post(`/auth/login`, {
        ...userInput,
      })
      var userItem = {
        name: data.user.name,
        id: data.user["_id"]
      }
      dispatch({ type: REGISTER_USER_SUCCESS, payload: userItem })
      localStorage.setItem(
        'user',
        JSON.stringify({ user: userItem, token: data.token })
      )
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR })
    }
  }

  // logout
  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: LOGOUT_USER })
  }

  // fetch comments
  const fetchComment = async ( ) => {
    var page = state.page
    var item = {
      page: page.currentPage,
      status: state.status,
      filter: state.filter
    }
    setLoading()
    try {
      const { data } = await axios.get(`/comments`, { params: item })
      dispatch({ type: FETCH_COMMENT_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: FETCH_COMMENT_ERROR })
      logout()
    }
  }

  // create comment
  const createComment = async (userInput) => {
    setLoading()
    try {
      const { data } = await axios.post(`/comments`, {
        ...userInput,
      })

      dispatch({ type: CREATE_COMMENT_SUCCESS, payload: data.comment })
      
    } catch (error) {
      dispatch({ type: CREATE_COMMENT_ERROR })
    }
  }
  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?") == true) {
    setLoadingForTable()
    try {
      await axios.delete(`/comments/${commentId}`)
      dispatch({ type: DELETE_COMMENT_SUCCESS})
      
      fetchComment()
    } catch (error) {
      dispatch({ type: DELETE_COMMENT_ERROR , payload: error.response.data.msg})
    }
  }
  }

  const fetchSingleComment = async (commentId) => {
    setLoading()
    try {
      const { data } = await axios.get(`/comments/${commentId}`)
      dispatch({ type: FETCH_SINGLE_COMMENT_SUCCESS, payload: data.comment })
    } catch (error) {
      dispatch({ type: FETCH_SINGLE_COMMENT_ERROR })
    }
  }
  const editComment = async (commentId, userInput) => {
    setLoading()
    try {
      const { data } = await axios.patch(`/comments/${commentId}`, {
        ...userInput,
      })
      dispatch({ type: EDIT_COMMENT_SUCCESS, payload: data.comment })
    } catch (error) {
      dispatch({ type: EDIT_COMMENT_ERROR })
    }
  }

  const likeComment = async (commentId) => {
    setLoadingForTable()
    const formData = {
      commentId: commentId
    }
    try {
      const { data } = await axios.post(`/comments/like`, formData)
      await fetchComment()
      await dispatch({ type: EDIT_COMMENT_SUCCESS })
    } catch (error) {
      dispatch({ type: EDIT_COMMENT_ERROR,payload: error.response.data.msg })
    }
  }

  const dislikeComment = async (commentId) => {
    setLoadingForTable()
    const formData = {
      commentId: commentId
    }
    try {
      const { data } = await axios.post(`/comments/dislike`, formData)
      await fetchComment()
      await dispatch({ type: EDIT_COMMENT_SUCCESS })
    } catch (error) {
      dispatch({ type: EDIT_COMMENT_ERROR,payload: error.response.data.msg })
    }
  }


  const handlePageClick = async (e) => {
    // page.currentPage = e.selected +1;
    await setLoadingForTable()
    await dispatch({ type: PAGE_CLICK,payload: e.selected +1 })
    await fetchComment()
  }

  const handleFilter = async (e) => {
    await dispatch({ type: SET_FILTER ,payload: e.target })
  }
  
  
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      var newUser = JSON.parse(user)
      newUser = newUser.user;
      dispatch({ type: SET_USER, payload: newUser,userId: newUser["id"]})
    }
  }, [])
  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        register,
        login,
        logout,
        fetchComment,
        createComment,
        deleteComment,
        fetchSingleComment,
        editComment,
        likeComment,
        dislikeComment,
        handlePageClick,
        handleFilter

      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider }
