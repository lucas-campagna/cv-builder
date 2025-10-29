import { Toggle as ToggleBase } from "@/components/ui/toggle"

const Toggle = ({ children, onToggle }: { children: React.ReactNode, onToggle?: () => void }) => (
  <ToggleBase
    size="sm"
    className="data-[state=on]:bg-black/10"
    onPressedChange={onToggle}
  >
    {children}
  </ToggleBase>
)
export default Toggle;
