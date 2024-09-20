import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups', async () => {
    const response = await fetch('http://localhost:8000/api/v1/groups');
    const data = await response.json();
    return data;
});

export const createGroup = createAsyncThunk(
    'groups/createGroup',
    async (groupData) => {
        const response = await fetch('http://localhost:8000/api/v1/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
        });
        if (!response.ok) {
            throw new Error('Failed to create group');
        }
        return response.json();
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/deleteGroup',
    async(groupId)=>{
        const response = await fetch(`http://localhost:8000/api/v1/group/${groupId}`, {
            method: 'DELETE'
        });
        if(!response.ok){
            throw new Error('Failed to delete group');
        }

        return groupId;
    }
);

export const createExpense = createAsyncThunk(
    'groups/createExpense',
    async (groupData) => {
      const response = await fetch('http://localhost:8000/api/v1/update-members-amount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
  
      const data = await response.json();
  
      // Call reload only after the response is successful and data is received
      window.location.reload();
  
      return data;
    }
  );

export const deleteExpense = createAsyncThunk(
    'groups/deleteExpense',
    async(IDs)=>{
        console.log(IDs);
        const groupId = IDs[0];
        const expenseId = IDs[1];
        console.log(groupId, expenseId);
        const url = `http://localhost:8000/api/v1/group/${groupId}/${expenseId}`;
        console.log(url);
        const response = await fetch(`http://localhost:8000/api/v1/group/${groupId}/${expenseId}`, {
            method: 'DELETE'
        });
        console.log(response);
        if(!response.ok){
            throw new Error('Failed to delete expense');
        }
        window.location.reload();
        return expenseId;
    }
);


const groupSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createGroup.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(createGroup.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.groups.push(action.payload);
        })
        .addCase(createGroup.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(fetchGroups.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchGroups.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.groups = action.payload;
        })
        .addCase(fetchGroups.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(deleteGroup.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteGroup.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.groups = state.groups.filter(group => group._id !== action.payload);
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});



export default groupSlice.reducer;
