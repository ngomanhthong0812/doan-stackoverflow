import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function RequireLoginDialog({ open, setOpen }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <p>{"You must login to perform this action."}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
