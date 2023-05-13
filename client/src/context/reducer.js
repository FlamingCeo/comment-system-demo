import {
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  SET_USER,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_ERROR,
  LOGOUT_USER,
  SET_LOADING,
  SET_LOADING_FOR_TABLE,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_ERROR,
  DELETE_COMMENT_ERROR,
  FETCH_SINGLE_COMMENT_SUCCESS,
  FETCH_SINGLE_COMMENT_ERROR,
  EDIT_COMMENT_ERROR,
  EDIT_COMMENT_SUCCESS,
  PAGE_CLICK,
  SET_FILTER
  
} from './actions'

const reducer = (state, action) => {
  if (action.type === SET_FILTER) {
      state[action.payload.name] = action.payload.value
    return { ...state }
  }

  if (action.type === SET_LOADING) {
    return { ...state, isLoading: true, showAlert: false, editComplete: false }
  }

  if (action.type === SET_LOADING_FOR_TABLE) {
    return { ...state, isLoadingForTable: false, showAlert: false, editComplete: false }

  }

  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload,
    }
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      user: null,
      showAlert: true,
    }
  }

  if (action.type === SET_USER) {
    return { ...state, user: action.payload, userId: action.userId }
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...state,
      user: null,
      showAlert: false,
      comments: [],
      isEditing: false,
      editItem: null,
    }
  }

  if (action.type === FETCH_COMMENT_SUCCESS) {
    const page = {
      pageCount: action.payload.totalPages,
      currentPage: action.payload.currentPage,
    }
    return {
      ...state,
      isLoading: false,
      editItem: null,
      singleCommentError: false,
      editComplete: false,
      comments: action.payload.comments,
      page: page
    }
  }
  if (action.type === FETCH_COMMENT_ERROR) {
    return { ...state, isLoading: false }
  }
  if (action.type === CREATE_COMMENT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      comments: [...state.comments, action.payload],
    }
  }
  if (action.type === CREATE_COMMENT_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
    }
  }

  if (action.type === DELETE_COMMENT_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      msg: action.payload,
      isLoadingForTable: true,
    }
  }

  if (action.type === FETCH_SINGLE_COMMENT_SUCCESS) {
    return { ...state, isLoading: false, editItem: action.payload }
  }
  if (action.type === FETCH_SINGLE_COMMENT_ERROR) {
    return { ...state, isLoading: false, editItem: '', singleCommentError: true }
  }

  if (action.type === EDIT_COMMENT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      editComplete: true,
      editItem: action.payload,
    }
  }
  if (action.type === EDIT_COMMENT_ERROR) {
    return {
      ...state,
      isLoading: false,
      editComplete: true,
      showAlert: true,
      msg: action.payload,
      isLoadingForTable: true

    }
  }

  
  if (action.type === PAGE_CLICK) {
    state["page"]["currentPage"] = action.payload
    return {
      ...state,
  
    }
  }
  throw new Error(`no such action : ${action}`)
}

export default reducer
