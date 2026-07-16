import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { apVendorService } from "../../api/apVendor/apMockService";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { useState } from "react";

interface DeleteApVendorProps {
  idItems: number[];
  onClose: () => void;
}

export default function DeleteApVendor({ idItems, onClose }: DeleteApVendorProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      let success = true;
      for (const id of idItems) {
        const res = await apVendorService.delete(id);
        if (!res) success = false;
      }
      if (success) {
        NotificationExtension.Success("Xóa nhà cung cấp thành công!");
        onClose();
        modals.closeAll();
      } else {
        NotificationExtension.Fails("Xóa thất bại!");
      }
    } catch {
      NotificationExtension.Fails("Đã xảy ra lỗi khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Text mb="lg">Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác.</Text>
      <Group justify="flex-end">
        <Button variant="outline" onClick={() => modals.closeAll()}>
          Hủy
        </Button>
        <Button color="red" onClick={handleDelete} loading={loading}>
          Xác nhận xóa
        </Button>
      </Group>
    </div>
  );
}
