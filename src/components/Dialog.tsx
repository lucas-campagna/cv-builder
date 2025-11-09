import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dialog = ({
  children,
  title,
  description,
  cancel,
  action,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  cancel?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <AlertDialog>
    <AlertDialogTrigger>{children}</AlertDialogTrigger>
    <AlertDialogContent>
      {(title || description) && (
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
      )}
      {(cancel || action) && (
        <AlertDialogFooter>
          {cancel && <AlertDialogCancel>{cancel}</AlertDialogCancel>}
          {action && <AlertDialogAction>{action}</AlertDialogAction>}
        </AlertDialogFooter>
      )}
    </AlertDialogContent>
  </AlertDialog>
);

export default Dialog;
