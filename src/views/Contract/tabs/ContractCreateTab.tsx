import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Input,
  List,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import {
  Contract,
  CONTRACT_SOURCE_LABEL,
  CONTRACT_STATUS_LABEL,
  ContractSource,
  TermLibraryItem,
} from "../../../model/ContractModel";
import { contractService } from "../../../api/contract/contractMockService";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { formatMoney, toDateInputValue } from "../components/contractShared";

interface Props {
  contract: Contract | null;
  onCreated: (newId: number, gotoTab?: string) => void;
  onChanged: () => void;
}

interface FormValues {
  source: ContractSource;
  name: string;
  contractType: string;
  description: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  effectiveDate: string;
  expiryDate: string;
  currency: string;
  value: number;
}

const CURRENCIES = ["VND", "USD", "EUR"];

const ContractCreateTab = ({ contract, onCreated, onChanged }: Props) => {
  const [library, setLibrary] = useState<TermLibraryItem[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [termSearch, setTermSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Chỉ cho sửa khi hợp đồng đang ở trạng thái nháp (hoặc đang tạo mới).
  const editable = !contract || contract.status === "draft";

  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: {
      source: "manual",
      name: "",
      contractType: "",
      description: "",
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
      effectiveDate: "",
      expiryDate: "",
      currency: "VND",
      value: 0,
    },
    validate: {
      name: (v) => (v.trim() ? null : "Vui lòng nhập tên hợp đồng"),
      supplierName: (v) => (v.trim() ? null : "Vui lòng nhập tên nhà cung cấp"),
    },
  });

  // Nạp thư viện điều khoản 1 lần.
  useEffect(() => {
    contractService.getTermLibrary().then(setLibrary);
  }, []);

  // Đồng bộ form + điều khoản đã chọn khi đổi hợp đồng đang xem.
  useEffect(() => {
    if (contract) {
      form.setValues({
        source: contract.source,
        name: contract.name,
        contractType: contract.contractType || "",
        description: contract.description || "",
        supplierName: contract.supplierName,
        supplierEmail: contract.supplierEmail || "",
        supplierPhone: contract.supplierPhone || "",
        supplierAddress: contract.supplierAddress || "",
        effectiveDate: toDateInputValue(contract.effectiveDate),
        expiryDate: toDateInputValue(contract.expiryDate),
        currency: contract.currency,
        value: contract.value,
      });
      contractService.getTerms(contract.contractId).then((terms) => {
        setSelectedTerms(terms.map((t) => t.code));
      });
    } else {
      form.reset();
      setSelectedTerms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.contractId]);

  const chosenLibraryItems = library.filter((l) => selectedTerms.includes(l.termCode));

  const persist = async (submit: boolean) => {
    const validation = form.validate();
    if (validation.hasErrors) return;
    setLoading(true);
    try {
      const payload: Partial<Contract> = {
        contractId: contract?.contractId,
        ...form.getValues(),
        effectiveDate: form.values.effectiveDate || null,
        expiryDate: form.values.expiryDate || null,
      };
      const saved = await contractService.save(payload);
      await contractService.setLibraryTerms(saved.contractId, chosenLibraryItems);

      if (submit) {
        await contractService.changeStatus(
          saved.contractId,
          "in_negotiation",
          "submit_contract",
          "Gửi yêu cầu đàm phán hợp đồng."
        );
        NotificationExtension.Success("Đã gửi yêu cầu, chuyển sang giai đoạn đàm phán.");
        onCreated(saved.contractId, "negotiation");
      } else {
        NotificationExtension.Success("Đã lưu nháp hợp đồng.");
        onCreated(saved.contractId);
      }
    } catch (e) {
      console.error(e);
      NotificationExtension.Fails("Lưu hợp đồng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => {
    form.reset();
    setSelectedTerms([]);
    onChanged();
    // Bỏ chọn hợp đồng hiện tại bằng cách reload — cha sẽ chọn lại phần tử đầu;
    // để tạo mới thuần, người dùng chỉ cần sửa form rồi lưu (không set contractId).
  };

  const filteredLibrary = library.filter((l) =>
    l.title.toLowerCase().includes(termSearch.toLowerCase())
  );

  const v = form.getValues();

  return (
    <Stack gap="md">
      {!editable && (
        <Paper withBorder p="sm" bg="var(--mantine-color-yellow-0)">
          <Text size="sm">
            Hợp đồng đang ở trạng thái <b>{CONTRACT_STATUS_LABEL[contract!.status]}</b> — chỉ xem, không
            chỉnh sửa. Dùng nút bên dưới để tạo hợp đồng mới.
          </Text>
        </Paper>
      )}

      {/* Nguồn tạo */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Nguồn tạo hợp đồng
        </Title>
        <Select
          label="Nguồn tạo"
          maw={360}
          disabled={!editable}
          data={(Object.keys(CONTRACT_SOURCE_LABEL) as ContractSource[]).map((s) => ({
            value: s,
            label: CONTRACT_SOURCE_LABEL[s],
          }))}
          value={v.source}
          onChange={(val) => val && form.setFieldValue("source", val as ContractSource)}
        />
      </Card>

      {/* Thông tin hợp đồng */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Tạo yêu cầu hợp đồng mới
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Tên hợp đồng"
              placeholder="Nhập tên hợp đồng"
              disabled={!editable}
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Loại hợp đồng"
              placeholder="Chọn loại hợp đồng"
              disabled={!editable}
              {...form.getInputProps("contractType")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Mô tả"
              placeholder="Nhập mô tả chi tiết về hợp đồng"
              minRows={3}
              autosize
              disabled={!editable}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Thông tin nhà cung cấp */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Thông tin nhà cung cấp
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Tên nhà cung cấp"
              placeholder="Nhập tên nhà cung cấp"
              disabled={!editable}
              {...form.getInputProps("supplierName")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Email liên hệ"
              placeholder="email@supplier.com"
              disabled={!editable}
              {...form.getInputProps("supplierEmail")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Số điện thoại"
              placeholder="+84 xxx xxx xxx"
              disabled={!editable}
              {...form.getInputProps("supplierPhone")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Địa chỉ"
              placeholder="Địa chỉ nhà cung cấp"
              disabled={!editable}
              {...form.getInputProps("supplierAddress")}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Chi tiết hợp đồng */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Chi tiết hợp đồng
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              type="date"
              label="Ngày hiệu lực"
              disabled={!editable}
              {...form.getInputProps("effectiveDate")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              type="date"
              label="Ngày hết hạn"
              disabled={!editable}
              {...form.getInputProps("expiryDate")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Đơn vị tiền tệ"
              data={CURRENCIES}
              disabled={!editable}
              value={v.currency}
              onChange={(val) => val && form.setFieldValue("currency", val)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <NumberInput
              label="Giá trị hợp đồng"
              placeholder="Nhập giá trị"
              thousandSeparator="."
              decimalSeparator=","
              min={0}
              disabled={!editable}
              value={v.value}
              onChange={(val) => form.setFieldValue("value", Number(val) || 0)}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Thư viện điều khoản */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Thư viện điều khoản
        </Title>
        <Input
          placeholder="Tìm kiếm điều khoản"
          leftSection={<IconSearch size={16} />}
          mb="sm"
          value={termSearch}
          onChange={(e) => setTermSearch(e.currentTarget.value)}
        />
        <Checkbox.Group value={selectedTerms} onChange={setSelectedTerms}>
          <Stack gap="xs">
            {filteredLibrary.map((l) => (
              <Checkbox
                key={l.termCode}
                value={l.termCode}
                label={l.title}
                disabled={!editable}
              />
            ))}
          </Stack>
        </Checkbox.Group>
      </Card>

      {/* Điều khoản đã chọn */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Điều khoản đã chọn
        </Title>
        {chosenLibraryItems.length === 0 ? (
          <Text size="sm" c="dimmed">
            Chưa chọn điều khoản nào
          </Text>
        ) : (
          <Stack gap="xs">
            {chosenLibraryItems.map((l) => (
              <Paper key={l.termCode} bg="var(--mantine-color-blue-0)" p="sm" radius="sm">
                <Text size="sm">{l.title}</Text>
              </Paper>
            ))}
          </Stack>
        )}
      </Card>

      {/* Xem trước hợp đồng */}
      <Card withBorder>
        <Title order={5} mb="sm">
          Xem trước hợp đồng
        </Title>
        <Paper withBorder p="lg" radius="sm">
          <Text ta="center" fw={700} size="lg">
            HỢP ĐỒNG
          </Text>
          <Text ta="center" size="sm" c="dimmed" mb="md">
            Số: {contract?.contractCode || "Sẽ sinh tự động khi lưu"}
          </Text>
          <Stack gap={4}>
            <PreviewRow label="Tên hợp đồng" value={v.name || "[Tên hợp đồng]"} />
            <PreviewRow label="Bên A" value="Công ty của bạn" />
            <PreviewRow label="Bên B" value={v.supplierName || "[Tên nhà cung cấp]"} />
            <PreviewRow label="Ngày hiệu lực" value={v.effectiveDate || "[Ngày bắt đầu]"} />
            <PreviewRow label="Ngày hết hạn" value={v.expiryDate || "[Ngày kết thúc]"} />
            <PreviewRow label="Loại hợp đồng" value={v.contractType || "[Loại hợp đồng]"} />
            <PreviewRow label="Nguồn tạo" value={CONTRACT_SOURCE_LABEL[v.source]} />
            <PreviewRow label="Mã tham chiếu" value={contract?.refCode || "[Chưa có]"} />
            <PreviewRow
              label="Giá trị hợp đồng"
              value={v.value ? formatMoney(v.value, v.currency) : "[Giá trị hợp đồng]"}
            />
          </Stack>
          <Text fw={600} size="sm" mt="md">
            Điều khoản áp dụng:
          </Text>
          {chosenLibraryItems.length === 0 ? (
            <Text size="sm" c="dimmed">
              [Chưa chọn điều khoản]
            </Text>
          ) : (
            <List size="sm">
              {chosenLibraryItems.map((l) => (
                <List.Item key={l.termCode}>{l.title}</List.Item>
              ))}
            </List>
          )}
        </Paper>
      </Card>

      {/* Hành động */}
      <Group justify="flex-end">
        {!editable && (
          <Button variant="default" onClick={startNew}>
            Tạo hợp đồng mới
          </Button>
        )}
        {editable && (
          <>
            <Button variant="default" loading={loading} onClick={() => persist(false)}>
              Lưu nháp
            </Button>
            <Button color="blue" loading={loading} onClick={() => persist(true)}>
              Gửi yêu cầu
            </Button>
          </>
        )}
      </Group>
    </Stack>
  );
};

const PreviewRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text size="sm" component="span" fw={600}>
      {label}:
    </Text>{" "}
    <Text size="sm" component="span">
      {value}
    </Text>
  </Box>
);

export default ContractCreateTab;
