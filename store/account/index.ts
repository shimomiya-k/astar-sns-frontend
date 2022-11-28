import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AccountState = {
  accounts: InjectedAccountWithMeta[];
  currentAccount?: InjectedAccountWithMeta;
};

export type UpdateAccountsPayload = InjectedAccountWithMeta[];

const initialState: AccountState = {
  accounts: [],
  currentAccount: undefined,
};

export const connectToContractThunk = createAsyncThunk<
  InjectedAccountWithMeta[]
>("account/connectToContract", async (_, { rejectWithValue }) => {
  return [];
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateAccounts(state, action: PayloadAction<UpdateAccountsPayload>) {
      state.accounts = action.payload;
      if (action.payload.length > 0) {
        state.currentAccount = action.payload[0];
      }
    },
    reset(): AccountState {
      return initialState;
    },
  },
  extraReducers(builder) {},
});
