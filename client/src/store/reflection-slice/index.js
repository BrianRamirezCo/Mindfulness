import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/lib/api";

const initialState = {
  isLoading: false,
  reflectionList: [],
  currentReflection: null,
};

export const getAllReflections = createAsyncThunk(
  "reflections/getAll",
  async () => {
    const response = await axios.get(`${API_URL}/api/reflections/admin/all`, {
      withCredentials: true,
    });
    return response.data;
  },
);

export const getPublishedReflections = createAsyncThunk(
  "reflections/getPublished",
  async () => {
    const response = await axios.get(`${API_URL}/api/reflections/published`);
    return response.data;
  },
);

export const getReflectionById = createAsyncThunk(
  "reflections/getById",
  async (id) => {
    const response = await axios.get(`${API_URL}/api/reflections/${id}`);
    return response.data;
  },
);

export const createReflection = createAsyncThunk(
  "reflections/create",
  async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/reflections/admin/create`,
      formData,
      { withCredentials: true },
    );
    return response.data;
  },
);

export const editReflection = createAsyncThunk(
  "reflections/edit",
  async ({ id, formData }) => {
    const response = await axios.put(
      `${API_URL}/api/reflections/admin/edit/${id}`,
      formData,
      { withCredentials: true },
    );
    return response.data;
  },
);

export const publishReflection = createAsyncThunk(
  "reflections/publish",
  async (id) => {
    const response = await axios.put(
      `${API_URL}/api/reflections/admin/publish/${id}`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },
);

export const deleteReflection = createAsyncThunk(
  "reflections/delete",
  async (id) => {
    const response = await axios.delete(
      `${API_URL}/api/reflections/admin/delete/${id}`,
      { withCredentials: true },
    );
    return response.data;
  },
);

export const addComment = createAsyncThunk(
  "reflections/addComment",
  async ({ id, userId, userName, text }) => {
    const response = await axios.post(
      `${API_URL}/api/reflections/comment/${id}`,
      { userId, userName, text },
    );
    return response.data;
  },
);

export const subscribeNewsletter = createAsyncThunk(
  "reflections/subscribe",
  async (email) => {
    const response = await axios.post(`${API_URL}/api/reflections/subscribe`, {
      email,
    });
    return response.data;
  },
);

const reflectionSlice = createSlice({
  name: "reflections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReflections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReflections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reflectionList = action.payload.data;
      })
      .addCase(getAllReflections.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getPublishedReflections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublishedReflections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reflectionList = action.payload.data;
      })
      .addCase(getPublishedReflections.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getReflectionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReflectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReflection = action.payload.data;
      })
      .addCase(getReflectionById.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createReflection.fulfilled, (state, action) => {
        state.reflectionList.unshift(action.payload.data);
      })
      .addCase(deleteReflection.fulfilled, (state, action) => {
        state.reflectionList = state.reflectionList.filter(
          (r) => r._id !== action.meta.arg,
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.currentReflection = action.payload.data;
      });
  },
});

export default reflectionSlice.reducer;
