import { AlertDialog, Button } from "@heroui/react";
import { Cross } from "lucide-react";

export default function TodoDeleteDialog({
  handler,
}: {
  handler: (param: boolean) => void;
}) {
  return (
    <AlertDialog>
      <Button
        isIconOnly
        variant="ghost"
        className={"w-10 h-6 active:scale-90 text-red-500"}
      >
        <Cross size={20} className="rotate-45" />
      </Button>
      <AlertDialog.Backdrop variant="blur">
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog className="sm:max-w-90">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Удалить задачу?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Задача будеть удалена навсегда. Восстановить будет невозможно.
                Уверены, что это необходимо?
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Отменить
              </Button>
              <Button
                slot="close"
                variant="danger"
                onClick={() => handler(true)}
              >
                Удалить задачу
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
