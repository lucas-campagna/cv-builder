import { AppStateContext } from "@/contexts/AppStateContext";
import { useContext } from "react";

const useAppState = () => useContext(AppStateContext);

export default useAppState;
