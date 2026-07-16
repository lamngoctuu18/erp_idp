import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Modal,
  Select,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconBuilding,
  IconEdit,
  IconInfoCircle,
  IconMapPin,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { apVendorService } from "../../api/apVendor/apMockService";
import { ApVendorModel, ApVendorAddressModel, ApVendorSiteModel } from "../../model/ApVendorModel";
import BreadCrumb from "../../_base/component/_layout/_breadcrumb";
import { modals } from "@mantine/modals";

const ApVendorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendor, setVendor] = useState<ApVendorModel | null>(null);
  const [addresses, setAddresses] = useState<ApVendorAddressModel[]>([]);
  const [sites, setSites] = useState<ApVendorSiteModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Address Modal state
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState<Partial<ApVendorAddressModel> | null>(null);

  // Site Modal state
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Partial<ApVendorSiteModel> | null>(null);
  const [selectedSiteAccounts, setSelectedSiteAccounts] = useState<any>(null);

  const addressForm = useForm({
    initialValues: {
      addressId: 0,
      addressName: "",
      countryCode: "VN",
      addressLine1: "",
      city: "",
      province: "",
      phone: "",
      email: "",
      purchasingFlag: "Y",
      paymentFlag: "Y",
    },
    validate: {
      addressLine1: (value: any) => (value ? null : "Địa chỉ chính là bắt buộc"),
    },
  });

  const siteForm = useForm({
    initialValues: {
      vendorSiteId: 0,
      vendorSiteCode: "",
      addressId: "",
      operatingUnitId: "1",
      phone: "",
      email: "",
      purchasingFlag: "Y",
      paymentFlag: "Y",
      rfqOnlyFlag: "N",
      primaryPayFlag: "N",
      // Site accounts mặc định
      liabilityCcid: "331001",
      prepaymentCcid: "331002",
    },
    validate: {
      vendorSiteCode: (value: any) => (value ? null : "Mã chi nhánh là bắt buộc"),
    },
  });

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const v = await apVendorService.getById(Number(id));
      if (v) {
        setVendor(v);
        const addrs = await apVendorService.getAddresses(v.vendorId);
        setAddresses(addrs);
        const s = await apVendorService.getSites(v.vendorId);
        setSites(s);
      } else {
        NotificationExtension.Fails("Không tìm thấy thông tin Nhà cung cấp.");
        navigate("/ApVendor/ApVendorList");
      }
    } catch {
      NotificationExtension.Fails("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ADDRESS HANDLERS
  const openAddressModal = (addr?: ApVendorAddressModel) => {
    if (addr) {
      setSelectedAddr(addr);
      addressForm.setValues({
        addressId: addr.addressId,
        addressName: addr.addressName || "",
        countryCode: addr.countryCode,
        addressLine1: addr.addressLine1,
        city: addr.city || "",
        province: addr.province || "",
        phone: addr.phone || "",
        email: addr.email || "",
        purchasingFlag: addr.purchasingFlag,
        paymentFlag: addr.paymentFlag,
      });
    } else {
      setSelectedAddr(null);
      addressForm.reset();
    }
    setAddrModalOpen(true);
  };

  const handleSaveAddress = async (values: typeof addressForm.values) => {
    if (!vendor) return;
    try {
      await apVendorService.saveAddress({
        ...values,
        vendorId: vendor.vendorId,
      } as any);
      NotificationExtension.Success(values.addressId ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ mới thành công!");
      setAddrModalOpen(false);
      // Reload addresses
      const addrs = await apVendorService.getAddresses(vendor.vendorId);
      setAddresses(addrs);
    } catch {
      NotificationExtension.Fails("Đã xảy ra lỗi khi lưu địa chỉ.");
    }
  };

  const handleDeleteAddress = async (addrId: number) => {
    modals.openConfirmModal({
      title: "Xác nhận xóa địa chỉ",
      children: <Text size="sm">Bạn có chắc chắn muốn xóa địa chỉ này?</Text>,
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await apVendorService.deleteAddress(addrId);
          NotificationExtension.Success("Xóa địa chỉ thành công!");
          if (vendor) {
            const addrs = await apVendorService.getAddresses(vendor.vendorId);
            setAddresses(addrs);
          }
        } catch {
          NotificationExtension.Fails("Đã xảy ra lỗi khi xóa địa chỉ.");
        }
      },
    });
  };

  // SITE HANDLERS
  const openSiteModal = async (site?: ApVendorSiteModel) => {
    if (site) {
      setSelectedSite(site);
      // Lấy Accounts của site
      const accounts = await apVendorService.getSiteAccounts(site.vendorSiteId);
      setSelectedSiteAccounts(accounts);
      siteForm.setValues({
        vendorSiteId: site.vendorSiteId,
        vendorSiteCode: site.vendorSiteCode,
        addressId: site.addressId ? String(site.addressId) : "",
        operatingUnitId: site.operatingUnitId ? String(site.operatingUnitId) : "1",
        phone: site.phone || "",
        email: site.email || "",
        purchasingFlag: site.purchasingFlag || "Y",
        paymentFlag: site.paymentFlag || "Y",
        rfqOnlyFlag: site.rfqOnlyFlag || "N",
        primaryPayFlag: site.primaryPayFlag || "N",
        liabilityCcid: accounts?.liabilityCcid ? String(accounts.liabilityCcid) : "331001",
        prepaymentCcid: accounts?.prepaymentCcid ? String(accounts.prepaymentCcid) : "331002",
      });
    } else {
      setSelectedSite(null);
      setSelectedSiteAccounts(null);
      siteForm.reset();
    }
    setSiteModalOpen(true);
  };

  const handleSaveSite = async (values: typeof siteForm.values) => {
    if (!vendor) return;
    try {
      const savedSite = await apVendorService.saveSite({
        vendorSiteId: values.vendorSiteId || undefined,
        vendorId: vendor.vendorId,
        vendorSiteCode: values.vendorSiteCode,
        addressId: values.addressId ? Number(values.addressId) : undefined,
        operatingUnitId: Number(values.operatingUnitId),
        phone: values.phone || undefined,
        email: values.email || undefined,
        purchasingFlag: values.purchasingFlag as any,
        paymentFlag: values.paymentFlag as any,
        rfqOnlyFlag: values.rfqOnlyFlag as any,
        primaryPayFlag: values.primaryPayFlag as any,
      });

      // Lưu accounts
      await apVendorService.saveSiteAccounts({
        vendorSiteId: savedSite.vendorSiteId,
        liabilityCcid: Number(values.liabilityCcid),
        prepaymentCcid: Number(values.prepaymentCcid),
      });

      NotificationExtension.Success(values.vendorSiteId ? "Cập nhật chi nhánh thành công!" : "Thêm chi nhánh mới thành công!");
      setSiteModalOpen(false);
      const s = await apVendorService.getSites(vendor.vendorId);
      setSites(s);
    } catch {
      NotificationExtension.Fails("Đã xảy ra lỗi khi lưu chi nhánh.");
    }
  };

  const handleDeleteSite = async (siteId: number) => {
    modals.openConfirmModal({
      title: "Xác nhận xóa chi nhánh",
      children: <Text size="sm">Bạn có chắc muốn xóa chi nhánh này cùng các tài khoản định khoản liên quan?</Text>,
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await apVendorService.deleteSite(siteId);
          NotificationExtension.Success("Xóa chi nhánh thành công!");
          if (vendor) {
            const s = await apVendorService.getSites(vendor.vendorId);
            setSites(s);
          }
        } catch {
          NotificationExtension.Fails("Đã xảy ra lỗi khi xóa.");
        }
      },
    });
  };

  if (isLoading || !vendor) {
    return (
      <Flex justify="center" align="center" style={{ height: 300 }}>
        <Loader size="lg" />
      </Flex>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex justify="space-between" align="center" style={{ borderBottom: "1px solid #dee2e6" }} pb={12} mb={16}>
        <BreadCrumb />
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/ApVendor/ApVendorList")}>
          Quay lại danh sách
        </Button>
      </Flex>

      {/* Header Info */}
      <Flex justify="space-between" align="start" mb={20}>
        <Box>
          <Group gap="sm">
            <Title order={3}>{vendor.vendorName}</Title>
            <Badge size="lg" color={vendor.enabledFlag === "Y" ? "green" : "red"}>
              {vendor.enabledFlag === "Y" ? "Đang hoạt động" : "Tạm ngưng"}
            </Badge>
          </Group>
          <Text c="dimmed" mt={4}>
            Mã đối tác: <strong style={{ color: "#333" }}>{vendor.segment1}</strong> | Phân loại:{" "}
            <strong>{vendor.vendorType === "ORGANIZATION" ? "Tổ chức" : vendor.vendorType === "PERSONAL" ? "Cá nhân" : "Nhân viên"}</strong>
          </Text>
        </Box>
        <Button variant="outline" color="yellow" leftSection={<IconEdit size={16} />} onClick={() => navigate(`/ApVendor/EditApVendor/${vendor.vendorId}`)}>
          Sửa đổi
        </Button>
      </Flex>

      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconInfoCircle size={16} />}>Thông tin chung</Tabs.Tab>
          <Tabs.Tab value="addresses" leftSection={<IconMapPin size={16} />}>Địa chỉ ({addresses.length})</Tabs.Tab>
          <Tabs.Tab value="sites" leftSection={<IconBuilding size={16} />}>Chi nhánh / Giao dịch ({sites.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Mã nhà cung cấp" value={vendor.segment1} readOnly disabled />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Tên nhà cung cấp" value={vendor.vendorName} readOnly disabled />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Mã số thuế" value={vendor.taxRegistrationNum || "N/A"} readOnly disabled />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Mã định danh D-U-N-S" value={vendor.dunsNumber || "N/A"} readOnly disabled />
            </Grid.Col>
            {vendor.vendorType === "EMPLOYEE" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput label="Mã nhân viên" value={vendor.employeeNumber || "N/A"} readOnly disabled />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Ngày tạo hệ thống" value={new Date(vendor.creationDate).toLocaleDateString("vi-VN")} readOnly disabled />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="addresses" pt="md">
          <Flex justify="flex-end" mb={12}>
            <Button variant="light" color="blue" leftSection={<IconPlus size={16} />} onClick={() => openAddressModal()}>
              Thêm địa chỉ
            </Button>
          </Flex>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f1f3f5", borderBottom: "2px solid #dee2e6", textAlign: "left" }}>
                <th style={{ padding: 8 }}>Tên địa điểm</th>
                <th style={{ padding: 8 }}>Địa chỉ</th>
                <th style={{ padding: 8 }}>Điện thoại / Email</th>
                <th style={{ padding: 8 }}>Mua hàng</th>
                <th style={{ padding: 8 }}>Thanh toán</th>
                <th style={{ padding: 8 }}>Trạng thái</th>
                <th style={{ padding: 8 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {addresses.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 12, textAlign: "center", color: "#868e96" }}>Chưa khai báo địa chỉ nào.</td>
                </tr>
              ) : (
                addresses.map((addr) => (
                  <tr key={addr.addressId} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: 8 }}><strong>{addr.addressName || "Địa chỉ phụ"}</strong></td>
                    <td style={{ padding: 8 }}>{`${addr.addressLine1}${addr.city ? `, ${addr.city}` : ""}${addr.province ? `, ${addr.province}` : ""}`}</td>
                    <td style={{ padding: 8 }}>{addr.phone || addr.email ? `${addr.phone || ""} / ${addr.email || ""}` : "N/A"}</td>
                    <td style={{ padding: 8 }}><Badge color={addr.purchasingFlag === "Y" ? "green" : "gray"}>{addr.purchasingFlag === "Y" ? "Có" : "Không"}</Badge></td>
                    <td style={{ padding: 8 }}><Badge color={addr.paymentFlag === "Y" ? "green" : "gray"}>{addr.paymentFlag === "Y" ? "Có" : "Không"}</Badge></td>
                    <td style={{ padding: 8 }}><Badge variant="outline" color={addr.status === "ACTIVE" ? "green" : "red"}>{addr.status}</Badge></td>
                    <td style={{ padding: 8 }}>
                      <Group gap="xs">
                        <ActionIcon variant="subtle" color="yellow" onClick={() => openAddressModal(addr)}><IconEdit size={16} /></ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteAddress(addr.addressId)}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Tabs.Panel>

        <Tabs.Panel value="sites" pt="md">
          <Flex justify="flex-end" mb={12}>
            <Button variant="light" color="blue" leftSection={<IconPlus size={16} />} onClick={() => openSiteModal()}>
              Thêm chi nhánh
            </Button>
          </Flex>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f1f3f5", borderBottom: "2px solid #dee2e6", textAlign: "left" }}>
                <th style={{ padding: 8 }}>Mã chi nhánh</th>
                <th style={{ padding: 8 }}>Phân quyền đơn vị (OU)</th>
                <th style={{ padding: 8 }}>Thông tin Site</th>
                <th style={{ padding: 8 }}>Đơn vị chính</th>
                <th style={{ padding: 8 }}>Mua hàng / Thanh toán</th>
                <th style={{ padding: 8 }}>Hoạt động</th>
                <th style={{ padding: 8 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 12, textAlign: "center", color: "#868e96" }}>Chưa khai báo chi nhánh giao dịch nào.</td>
                </tr>
              ) : (
                sites.map((site) => (
                  <tr key={site.vendorSiteId} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: 8 }}><strong>{site.vendorSiteCode}</strong></td>
                    <td style={{ padding: 8 }}><Badge color="cyan">Operating Unit {site.operatingUnitId}</Badge></td>
                    <td style={{ padding: 8 }}>{site.email || site.phone ? `${site.email || ""} - ${site.phone || ""}` : "Theo địa chỉ chính"}</td>
                    <td style={{ padding: 8 }}><Badge color={site.primaryPayFlag === "Y" ? "indigo" : "gray"}>{site.primaryPayFlag === "Y" ? "Chính" : "Phụ"}</Badge></td>
                    <td style={{ padding: 8 }}>{`Mua: ${site.purchasingFlag === "Y" ? "Có" : "K"} | Chi: ${site.paymentFlag === "Y" ? "Có" : "K"}`}</td>
                    <td style={{ padding: 8 }}><Badge color={site.enabledFlag === "Y" ? "green" : "red"}>{site.enabledFlag === "Y" ? "Có" : "Không"}</Badge></td>
                    <td style={{ padding: 8 }}>
                      <Group gap="xs">
                        <Tooltip label="Sửa & Cấu hình tài khoản"><ActionIcon variant="subtle" color="yellow" onClick={() => openSiteModal(site)}><IconEdit size={16} /></ActionIcon></Tooltip>
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteSite(site.vendorSiteId)}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Tabs.Panel>
      </Tabs>

      {/* Address Edit/Create Modal */}
      <Modal opened={addrModalOpen} onClose={() => setAddrModalOpen(false)} title={selectedAddr ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"} size="md">
        <form onSubmit={addressForm.onSubmit(handleSaveAddress)}>
          <Flex direction="column" gap="sm">
            <TextInput label="Tên gợi nhớ địa điểm" placeholder="Ví dụ: Kho chính, VP Hà Nội" {...addressForm.getInputProps("addressName")} />
            <TextInput required label="Địa chỉ dòng 1" placeholder="Số nhà, đường phố..." {...addressForm.getInputProps("addressLine1")} />
            <Group grow>
              <TextInput label="Thành phố" placeholder="Hà Nội, TP.HCM" {...addressForm.getInputProps("city")} />
              <TextInput label="Tỉnh / Bang" placeholder="Hà Nội, Bình Dương..." {...addressForm.getInputProps("province")} />
            </Group>
            <Group grow>
              <TextInput label="Điện thoại liên lạc" placeholder="Số điện thoại" {...addressForm.getInputProps("phone")} />
              <TextInput label="Hòm thư điện tử" placeholder="email@address.com" {...addressForm.getInputProps("email")} />
            </Group>
            <Group grow>
              <Switch label="Dùng cho đặt hàng" checked={addressForm.values.purchasingFlag === "Y"} onChange={(e) => addressForm.setFieldValue("purchasingFlag", e.currentTarget.checked ? "Y" : "N")} />
              <Switch label="Dùng cho thanh toán" checked={addressForm.values.paymentFlag === "Y"} onChange={(e) => addressForm.setFieldValue("paymentFlag", e.currentTarget.checked ? "Y" : "N")} />
            </Group>
            <Button type="submit" color="blue" mt="sm">Lưu địa chỉ</Button>
          </Flex>
        </form>
      </Modal>

      {/* Site Edit/Create Modal with Account Segment Configuration */}
      <Modal opened={siteModalOpen} onClose={() => setSiteModalOpen(false)} title={selectedSite ? "Cấu hình Chi nhánh & Định khoản" : "Thêm chi nhánh mới"} size="lg">
        <form onSubmit={siteForm.onSubmit(handleSaveSite)}>
          <Flex direction="column" gap="md">
            <Title order={5} style={{ borderBottom: "1px solid #dee2e6" }} pb={6}>1. Tham số chi nhánh giao dịch</Title>
            <Group grow>
              <TextInput required label="Mã Chi nhánh (Site Code)" placeholder="Ví dụ: HN-STORE" {...siteForm.getInputProps("vendorSiteCode")} />
              <Select label="Liên kết Địa chỉ gốc" placeholder="Chọn địa chỉ" data={addresses.map((a) => ({ value: String(a.addressId), label: a.addressName || a.addressLine1 }))} {...siteForm.getInputProps("addressId")} />
            </Group>
            <Group grow>
              <Select label="Operating Unit quyền sở hữu" data={[{ value: "1", label: "Hà Nội HQ (OU 1)" }, { value: "2", label: "HCM Branch (OU 2)" }]} {...siteForm.getInputProps("operatingUnitId")} />
              <TextInput label="Email nhận thông báo giao dịch" placeholder="ke-toan@ncc.com" {...siteForm.getInputProps("email")} />
            </Group>
            <Group grow>
              <Switch label="Cho phép Mua hàng" checked={siteForm.values.purchasingFlag === "Y"} onChange={(e) => siteForm.setFieldValue("purchasingFlag", e.currentTarget.checked ? "Y" : "N")} />
              <Switch label="Cho phép Thanh toán" checked={siteForm.values.paymentFlag === "Y"} onChange={(e) => siteForm.setFieldValue("paymentFlag", e.currentTarget.checked ? "Y" : "N")} />
              <Switch label="Chi nhánh thanh toán chính" checked={siteForm.values.primaryPayFlag === "Y"} onChange={(e) => siteForm.setFieldValue("primaryPayFlag", e.currentTarget.checked ? "Y" : "N")} />
            </Group>

            <Title order={5} style={{ borderBottom: "1px solid #dee2e6" }} pb={6} mt="xs">2. Cấu hình Tài khoản kế toán mặc định (AP_VENDOR_SITE_ACCOUNTS)</Title>
            <Group grow>
              <Select
                required
                label="Tài khoản Nợ phải trả người bán (Liability CCID)"
                data={[
                  { value: "331001", label: "331001 - Phải trả người bán (Hà Nội)" },
                  { value: "331004", label: "331004 - Phải trả người bán (Hồ Chí Minh)" },
                ]}
                {...siteForm.getInputProps("liabilityCcid")}
              />
              <Select
                required
                label="Tài khoản Tạm ứng đặt cọc (Prepayment CCID)"
                data={[
                  { value: "331002", label: "331002 - Trả trước cho người bán (Hà Nội)" },
                  { value: "331005", label: "331005 - Trả trước cho người bán (Hồ Chí Minh)" },
                ]}
                {...siteForm.getInputProps("prepaymentCcid")}
              />
            </Group>

            <Button type="submit" color="blue" mt="sm">Lưu thông tin & định khoản</Button>
          </Flex>
        </form>
      </Modal>
    </Card>
  );
};

export default ApVendorDetail;
