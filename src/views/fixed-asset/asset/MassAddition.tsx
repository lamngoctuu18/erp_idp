import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Select,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch, IconUpload } from "@tabler/icons-react";
import { FaNotice, FaPageHeader, FaSteps, money } from "../_components/FaCommon";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  FA_BOOKS,
  getMassAdditions,
  postMassAdditions,
  updateMassAdditionQueue,
} from "../../../api/fixed-asset/api";
import { FaMassAddition } from "../../../model/FixedAssetModel";

const queueColor: Record<string, string> = {
  NEW: "yellow",
  POST: "blue",
  "ON HOLD": "orange",
  POSTED: "teal",
  SPLIT: "grape",
  MERGED: "cyan",
};

const MassAddition = () => {
  const [rows, setRows] = useState<FaMassAddition[]>([]);
  const [book, setBook] = useState<string | null>("IDP_CORP");
  const [queue, setQueue] = useState<string | null>("ALL");
  const [invoice, setInvoice] = useState("");

  const load = async () => {
    const res = await getMassAdditions(queue || "ALL");
    if (res?.success) {
      let data = res.data;
      if (invoice) data = data.filter((d) => d.invoiceNumber.toLowerCase().includes(invoice.toLowerCase()));
      setRows(data);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  const setQ = async (massId: number, q: FaMassAddition["queue"]) => {
    const res = await updateMassAdditionQueue(massId, q);
    if (res?.success) {
      NotificationExtension.Success(`Đã chuyển dòng sang hàng đợi ${q}.`);
      load();
    }
  };

  const handlePost = async () => {
    const res = await postMassAdditions(book || "IDP_CORP");
    if (res?.success) {
      NotificationExtension.Success(`Đã Post ${res.data} dòng thành tài sản mới.`);
      load();
    }
  };

  return (
    <Box>
      <FaPageHeader
        actions={
          <>
            <Button variant="outline" color="gray">
              Tải lỗi
            </Button>
            <Button color="blue" leftSection={<IconUpload size={14} />} onClick={handlePost}>
              Post Mass Additions
            </Button>
          </>
        }
      />

      <Title order={3} mb={8}>
        Mass Addition từ AP
      </Title>
      <FaSteps labels={["Hóa đơn AP", "Transfer sang FA", "Prepare", "Post"]} active={2} />

      <FaNotice type="info">
        Chỉ lấy invoice đã <b>Validate</b>, <b>Final Accounted</b> và distribution có <b>Track as Asset</b>. Đổi Queue sang
        POST để tài sản được tạo khi chạy Post Mass Additions.
      </FaNotice>

      <Card withBorder shadow="sm" radius="md" p="md" mb={16}>
        <Grid align="end">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select label="Book" data={FA_BOOKS} value={book} onChange={setBook} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput label="Invoice Number" placeholder="AP-26070082" value={invoice} onChange={(e) => setInvoice(e.currentTarget.value)} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Queue"
              data={[
                { value: "ALL", label: "Tất cả" },
                { value: "NEW", label: "New" },
                { value: "POST", label: "Post" },
                { value: "ON HOLD", label: "On Hold" },
                { value: "POSTED", label: "Posted" },
              ]}
              value={queue}
              onChange={setQueue}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Button fullWidth leftSection={<IconSearch size={14} />} onClick={load}>
              Tìm
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Title order={5} mb="md">
          Hóa đơn chờ chuẩn bị ({rows.length})
        </Title>
        <Table.ScrollContainer minWidth={900}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead style={{ background: "#f8fafc" }}>
              <Table.Tr>
                <Table.Th>Invoice</Table.Th>
                <Table.Th>Nhà cung cấp</Table.Th>
                <Table.Th style={{ textAlign: "right" }}>Giá trị</Table.Th>
                <Table.Th>Track as Asset</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Queue</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                    Không có dòng Mass Addition.
                  </Table.Td>
                </Table.Tr>
              ) : (
                rows.map((r) => (
                  <Table.Tr key={r.massId}>
                    <Table.Td fw={600}>{r.invoiceNumber}</Table.Td>
                    <Table.Td>{r.supplierName}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{money(r.amount)}</Table.Td>
                    <Table.Td>
                      <Badge color={r.trackAsAsset ? "teal" : "gray"} variant="light">
                        {r.trackAsAsset ? "Yes" : "No"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{r.category}</Table.Td>
                    <Table.Td>
                      <Badge color={queueColor[r.queue] || "gray"} variant="light">
                        {r.queue}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {r.queue === "NEW" && (
                        <Button size="xs" variant="light" onClick={() => setQ(r.massId, "POST")}>
                          Chuyển POST
                        </Button>
                      )}
                      {r.queue === "POST" && (
                        <Button size="xs" variant="light" color="orange" onClick={() => setQ(r.massId, "ON HOLD")}>
                          On Hold
                        </Button>
                      )}
                      {r.queue === "ON HOLD" && (
                        <Button size="xs" variant="light" onClick={() => setQ(r.massId, "POST")}>
                          Chuyển POST
                        </Button>
                      )}
                      {r.queue === "POSTED" && <Badge color="teal">Đã tạo tài sản</Badge>}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Box>
  );
};

export default MassAddition;
