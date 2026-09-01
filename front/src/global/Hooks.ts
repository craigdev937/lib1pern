import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./RED";

export const UAS = useSelector.withTypes<RootState>();
export const UAD = useDispatch.withTypes<AppDispatch>();


