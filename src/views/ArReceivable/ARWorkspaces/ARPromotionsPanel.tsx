import { Badge, Box, Button, Card, Flex, Table, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ARMockStorage } from "../mock/arMockStorage";
import { formatDateTime, formatNumber } from "../../../common/FormatDate/FormatDate";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

export default function ARPromotionsPanel() {
  const promotions = ARMockStorage.getPromotions();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="md">
        <Box>
          <Title order={4}>Chương trình khuyến mại</Title>
          <Text c="dimmed" size="sm">Quản lý điều kiện và thời gian hiệu lực; thao tác Apply được thực hiện tại hóa đơn.</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={() => NotificationExtension.Success("Đã mở form tạo chương trình khuyến mại (Demo).")}>Tạo chương trình</Button>
      </Flex>

      <Card withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mã chương trình</Table.Th>
              <Table.Th>Tên chương trình</Table.Th>
              <Table.Th>Loại giảm giá</Table.Th>
              <Table.Th>Ngày hiệu lực</Table.Th>
              <Table.Th ta="right">Mức giảm tối đa</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {promotions.map((promotion) => (
              <Table.Tr key={promotion.promotionId}>
                <Table.Td fw={700}>{promotion.code}</Table.Td>
                <Table.Td>{promotion.name}</Table.Td>
                <Table.Td>{promotion.promotionType}</Table.Td>
                <Table.Td>{formatDateTime(promotion.startDate, "DD/MM/YYYY")} – {formatDateTime(promotion.endDate, "DD/MM/YYYY")}</Table.Td>
                <Table.Td ta="right">{promotion.maxDiscountLimit ? formatNumber(promotion.maxDiscountLimit) : "Theo chính sách"}</Table.Td>
                <Table.Td><Badge color={promotion.status === "APPROVED" ? "teal" : "gray"}>{promotion.status}</Badge></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}
