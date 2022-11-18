import {AppThunk} from "../../store/store"
import {hackerNewsAPI, StoryType} from '../../api/api';
import {setAppStatus, setIsInitialized} from '../../app/app-reducer';
import {errorHandlerUtil} from '../../common/utils/errors-utils';

const initialState = {
    stories: null as StoryType[] | null,
}

export const newStoriesReducer = (state = initialState, action: NewStoriesActionType): InitialNewStoriesStateType => {
    switch (action.type) {
        case 'NEW-STORIES/SET-STORIES-DATA':
            return {...state, stories: action.date}
        default:
            return state
    }
}

// Actions
export const setStoriesData = (date: StoryType[]) => ({type: 'NEW-STORIES/SET-STORIES-DATA', date} as const)

// Thunks
export const setStories = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatus('loading'))
    try {
        const resStories = (await hackerNewsAPI.getStories()).data.filter((el, index) => index < 100)
        const res = (await Promise.all(
            resStories.map(async (el) => {
                const resStory = await hackerNewsAPI.getStory(el)
                return resStory.data
            }))).filter(el => el !== null)
        dispatch(setStoriesData(res))
    } catch (e) {
        errorHandlerUtil(e, dispatch)
    } finally {
        dispatch(setIsInitialized(true))
        dispatch(setAppStatus('idle'))
    }
}

// Types
export type InitialNewStoriesStateType = typeof initialState

export type NewStoriesActionType = ReturnType<typeof setStoriesData>