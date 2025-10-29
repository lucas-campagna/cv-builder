import { DynamicComponents } from "@/contexts/DynamicComponentsProvider"
import { useContext } from "react"

const useDynamicComponents = () => useContext(DynamicComponents);

export default useDynamicComponents;
