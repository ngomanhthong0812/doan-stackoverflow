import { RequireLoginDialog } from "@/components/features/require-login-dialog";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";

export function useRequireLogin() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

  const requireLogin = () => {
    if (!user) {
      setOpenDialog(true);
      return false;
    }
    return true;
  };

  const Dialog = (
    <RequireLoginDialog open={openDialog} setOpen={setOpenDialog} />
  );

  return { requireLogin, Dialog };
}
