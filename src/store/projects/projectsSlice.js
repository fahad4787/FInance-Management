import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAllProjects as getAllProjectsService,
  saveProject as saveProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService
} from '../../services/projectService';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  return await getAllProjectsService();
});

export const createProject = createAsyncThunk('projects/create', async (projectData, { dispatch }) => {
  await saveProjectService(projectData);
  await dispatch(fetchProjects());
});

export const editProject = createAsyncThunk(
  'projects/edit',
  async ({ projectId, projectData }, { dispatch }) => {
    await updateProjectService(projectId, projectData);
    await dispatch(fetchProjects());
  }
);

export const removeProject = createAsyncThunk('projects/delete', async (projectId, { dispatch }) => {
  await deleteProjectService(projectId);
  await dispatch(fetchProjects());
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.isLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load projects';
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('projects/create/') ||
          action.type.startsWith('projects/edit/') ||
          action.type.startsWith('projects/delete/'),
        (state, action) => {
          if (action.type.endsWith('/pending')) {
            state.isLoading = true;
            state.error = null;
          }
          if (action.type.endsWith('/rejected')) {
            state.isLoading = false;
            state.error = action.error?.message || 'Project action failed';
          }
          if (action.type.endsWith('/fulfilled')) {
            state.isLoading = false;
          }
        }
      );
  }
});

export default projectsSlice.reducer;

