import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type OptionMenuItems = {
  label: string;
  onClick?: () => void;
};

const OptionMenu = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: OptionMenuItems[];
}) => (
  <ContextMenu>
    <ContextMenuTrigger>{children}</ContextMenuTrigger>
    <ContextMenuContent>
      {items.map((item) => (
        <ContextMenuItem key={item.label} onClick={item.onClick} disabled={!item.onClick}>
          {item.label}
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  </ContextMenu>
);

export default OptionMenu;
