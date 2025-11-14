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
  body,
  cancel,
  action,
  ...props
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  body?: React.ReactNode;
  cancel?: string;
  action?: string;
} & React.ComponentProps<typeof AlertDialog>) => (
  <AlertDialog {...props}>
    <AlertDialogTrigger>{children}</AlertDialogTrigger>
    <AlertDialogContent>
      {(title || description) && (
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {body ? (
            <>
              {body}
              <AlertDialogDescription />
            </>
          ) : (
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
