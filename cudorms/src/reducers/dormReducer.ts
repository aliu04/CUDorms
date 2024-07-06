import { Dorm } from '../interfaces';

type Action =
  | { type: 'EDIT_FIELD'; field: string; value: any }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SAVE_EDIT' }
  | { type: 'DELETE_DORM' }
  | { type: 'SET_DORM'; dorm: Dorm };

interface State {
  dorm: Dorm | null;
  isEditing: boolean;
  originalDorm: Dorm | null;
}

const initialState: State = {
  dorm: null,
  isEditing: false,
  originalDorm: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'EDIT_FIELD':
      if (!state.dorm) return state;
      return {
        ...state,
        dorm: { ...state.dorm, [action.field]: action.value },
      };
    case 'CANCEL_EDIT':
      return {
        ...state,
        dorm: state.originalDorm,
        isEditing: false,
      };
    case 'SAVE_EDIT':
      return {
        ...state,
        originalDorm: state.dorm,
        isEditing: false,
      };
    case 'DELETE_DORM':
      return initialState;
    case 'SET_DORM':
      return {
        ...state,
        dorm: action.dorm,
        originalDorm: action.dorm,
      };
    default:
      throw new Error('Unknown action type');
  }
}

export { initialState, reducer, State, Action };
