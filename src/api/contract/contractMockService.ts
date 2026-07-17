/**
 * Mock service cho phân hệ Quản lý Hợp đồng.
 *
 * Lưu dữ liệu trong localStorage (offline, không cần backend) — theo đúng khuôn
 * `apMockService.ts`. Khi backend sẵn sàng, chỉ cần thay thân các hàm bên dưới
 * bằng lời gọi axios, giữ nguyên chữ ký (signature) để UI không phải sửa.
 */
import {
  Contract,
  ContractTerm,
  ContractStatus,
  TermLibraryItem,
  NegotiationMessage,
  NegotiationSenderType,
  ApprovalStep,
  ContractSignature,
  CatalogItem,
  ContractActionLog,
} from "../../model/ContractModel";

// Helper delay để UI loading hiển thị tự nhiên
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  CONTRACTS: "ct_contracts",
  TERMS: "ct_terms",
  TERM_LIBRARY: "ct_term_library",
  MESSAGES: "ct_messages",
  APPROVALS: "ct_approvals",
  SIGNATURES: "ct_signatures",
  CATALOG_ITEMS: "ct_catalog_items",
  LOGS: "ct_logs",
  INITIALIZED: "ct_db_initialized",
};

// ID sequence dùng chung — lấy max + 1 trên mảng
const nextId = <T,>(list: T[], key: keyof T, start = 1): number =>
  list.length > 0 ? Math.max(...list.map((x) => Number(x[key]))) + 1 : start;

const read = <T,>(key: string): T[] => JSON.parse(localStorage.getItem(key) || "[]");
const write = <T,>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));
const now = () => new Date().toISOString();

// ─────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────

export const initializeMockDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  // Thư viện điều khoản mẫu (khớp danh sách checkbox trên giao diện)
  const termLibrary: TermLibraryItem[] = [
    { termCode: "PAYMENT", title: "Điều khoản thanh toán", content: "Bên A thanh toán cho Bên B trong vòng 30 ngày kể từ ngày nhận đủ hàng hóa/dịch vụ và hóa đơn hợp lệ." },
    { termCode: "WARRANTY", title: "Điều khoản bảo hành", content: "Bên B bảo hành hàng hóa/dịch vụ trong thời gian 12 tháng kể từ ngày nghiệm thu." },
    { termCode: "CONFIDENTIAL", title: "Điều khoản bảo mật thông tin", content: "Hai bên cam kết bảo mật toàn bộ thông tin trao đổi trong quá trình thực hiện hợp đồng." },
    { termCode: "TERMINATION", title: "Điều khoản chấm dứt hợp đồng", content: "Hợp đồng có thể được chấm dứt khi một trong hai bên vi phạm nghiêm trọng nghĩa vụ đã cam kết." },
    { termCode: "PENALTY", title: "Điều khoản phạt vi phạm", content: "Bên vi phạm chịu phạt tối đa 8% giá trị phần nghĩa vụ hợp đồng bị vi phạm." },
    { termCode: "DISPUTE", title: "Điều khoản giải quyết tranh chấp", content: "Mọi tranh chấp được ưu tiên giải quyết bằng thương lượng; nếu không thành sẽ đưa ra Tòa án có thẩm quyền." },
  ];

  // 3 hợp đồng mẫu (khớp cột danh sách trên ảnh)
  const contracts: Contract[] = [
    {
      contractId: 1,
      contractCode: "HD-20260421174310",
      refCode: "HDPE-2026",
      name: "HDPE-2026",
      contractType: "Cung cấp nguyên vật liệu",
      description: "Hợp đồng cung cấp nguyên vật liệu cho nhà máy.",
      source: "manual",
      status: "pending_approval",
      supplierName: "Nhà máy 1 thành viên",
      supplierEmail: "sales@nhamay1.vn",
      supplierPhone: "+84 24 1111 2222",
      supplierAddress: "KCN Bắc Ninh",
      effectiveDate: "2026-04-21",
      expiryDate: "2026-05-07",
      currency: "VND",
      value: 5,
      catalogStatus: "not_published",
      catalogName: "HDPE-2026",
      catalogScope: "Nhà máy 1 thành viên",
      catalogType: "Nguyên vật liệu",
      signed: false,
      createdAt: "2026-04-21T17:43:00.000Z",
      updatedAt: "2026-04-21T18:07:01.000Z",
    },
    {
      contractId: 2,
      contractCode: "HD-20260421-003",
      refCode: null,
      name: "Hợp đồng tư vấn Công ty DEF",
      contractType: "Dịch vụ tư vấn",
      description: "Hợp đồng cung cấp dịch vụ tư vấn.",
      source: "manual",
      status: "closed",
      supplierName: "Công ty DEF",
      supplierEmail: "contact@def.vn",
      currency: "VND",
      value: 120000000,
      effectiveDate: "2026-04-18",
      expiryDate: "2026-10-18",
      catalogStatus: "published",
      signed: true,
      createdAt: "2026-04-18T09:00:00.000Z",
      updatedAt: "2026-04-18T09:00:00.000Z",
    },
    {
      contractId: 3,
      contractCode: "HD-20260421-002",
      refCode: null,
      name: "Hợp đồng dịch vụ IT Tập đoàn XYZ",
      contractType: "Dịch vụ IT",
      description: "Hợp đồng cung cấp dịch vụ công nghệ thông tin.",
      source: "from_po",
      status: "active",
      supplierName: "Tập đoàn XYZ",
      supplierEmail: "it@xyz.vn",
      currency: "VND",
      value: 580000000,
      effectiveDate: "2026-04-14",
      expiryDate: "2027-04-14",
      catalogStatus: "published",
      signed: true,
      createdAt: "2026-04-14T08:00:00.000Z",
      updatedAt: "2026-04-14T08:00:00.000Z",
    },
  ];

  // Điều khoản đang đàm phán cho HĐ #1 (khớp bảng so sánh phiên bản)
  const terms: ContractTerm[] = [
    {
      termId: 1,
      contractId: 1,
      code: "HDPE-4/2026",
      title: "Điều khoản bổ sung",
      originalContent: "test",
      currentContent: "test",
      version: 1,
      status: "pending",
    },
  ];

  // Lịch sử đàm phán HĐ #1
  const messages: NegotiationMessage[] = [
    { messageId: 1, contractId: 1, senderType: "buyer", content: "xxxx", createdAt: "2026-04-21T18:04:03.000Z" },
    { messageId: 2, contractId: 1, senderType: "system", content: "Đã thêm điều khoản mới: HDPE-4/2026", createdAt: "2026-04-21T18:06:58.000Z" },
    { messageId: 3, contractId: 1, senderType: "system", content: "Kết thúc đàm phán và chuyển sang chờ phê duyệt.", createdAt: "2026-04-21T18:07:01.000Z" },
  ];

  // Log HĐ #1
  const logs: ContractActionLog[] = [
    { logId: 1, contractId: 1, actionCode: "submit_contract", actorName: "System User - buyer", fromStatus: "draft", toStatus: "pending_approval", note: "Khởi tạo và gửi hợp đồng để xử lý/phê duyệt", createdAt: "2026-04-21T17:43:11.000Z" },
    { logId: 2, contractId: 1, actionCode: "close_negotiation", actorName: "System User - buyer", fromStatus: "in_negotiation", toStatus: "pending_approval", note: "Kết thúc đàm phán hợp đồng", createdAt: "2026-04-21T18:07:01.000Z" },
  ];

  write(KEYS.TERM_LIBRARY, termLibrary);
  write(KEYS.CONTRACTS, contracts);
  write(KEYS.TERMS, terms);
  write(KEYS.MESSAGES, messages);
  write(KEYS.LOGS, logs);
  write(KEYS.APPROVALS, [] as ApprovalStep[]);
  write(KEYS.SIGNATURES, [] as ContractSignature[]);
  write(KEYS.CATALOG_ITEMS, [] as CatalogItem[]);

  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// ─────────────────────────────────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────────────────────────────────

const logAction = (
  contractId: number,
  actionCode: string,
  note?: string,
  fromStatus?: ContractStatus | null,
  toStatus?: ContractStatus | null,
  actorName = "System User - buyer"
) => {
  const logs = read<ContractActionLog>(KEYS.LOGS);
  logs.push({
    logId: nextId(logs, "logId"),
    contractId,
    actionCode,
    actorName,
    fromStatus,
    toStatus,
    note,
    createdAt: now(),
  });
  write(KEYS.LOGS, logs);
};

const pushSystemMessage = (contractId: number, content: string, senderType: NegotiationSenderType = "system") => {
  const list = read<NegotiationMessage>(KEYS.MESSAGES);
  list.push({ messageId: nextId(list, "messageId"), contractId, senderType, content, createdAt: now() });
  write(KEYS.MESSAGES, list);
};

// ─────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────

export const contractService = {
  // ---- Thư viện điều khoản ----
  getTermLibrary: async (): Promise<TermLibraryItem[]> => {
    initializeMockDB();
    return read<TermLibraryItem>(KEYS.TERM_LIBRARY);
  },

  // ---- Hợp đồng ----
  getAll: async (keySearch = "", status?: ContractStatus | null): Promise<Contract[]> => {
    await delay();
    initializeMockDB();
    let list = read<Contract>(KEYS.CONTRACTS);
    if (status) list = list.filter((x) => x.status === status);
    if (keySearch) {
      const q = keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.contractCode.toLowerCase().includes(q) ||
          x.name.toLowerCase().includes(q) ||
          x.supplierName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.contractId - a.contractId);
  },

  getById: async (id: number): Promise<Contract | null> => {
    await delay(150);
    initializeMockDB();
    return read<Contract>(KEYS.CONTRACTS).find((x) => x.contractId === id) || null;
  },

  /** Lưu (tạo mới hoặc cập nhật). Trả về hợp đồng sau lưu. */
  save: async (data: Partial<Contract>): Promise<Contract> => {
    await delay();
    initializeMockDB();
    const list = read<Contract>(KEYS.CONTRACTS);

    if (data.contractId) {
      const idx = list.findIndex((x) => x.contractId === data.contractId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: now() } as Contract;
        write(KEYS.CONTRACTS, list);
        return list[idx];
      }
    }

    // Tạo mới
    const newId = nextId(list, "contractId");
    const ts = new Date();
    const code = `HD-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}${String(newId).padStart(3, "0")}`;
    const created: Contract = {
      contractId: newId,
      contractCode: code,
      refCode: data.refCode ?? null,
      name: data.name || "Hợp đồng chưa đặt tên",
      contractType: data.contractType,
      description: data.description,
      source: data.source || "manual",
      status: "draft",
      supplierName: data.supplierName || "",
      supplierEmail: data.supplierEmail,
      supplierPhone: data.supplierPhone,
      supplierAddress: data.supplierAddress,
      effectiveDate: data.effectiveDate ?? null,
      expiryDate: data.expiryDate ?? null,
      currency: data.currency || "VND",
      value: data.value || 0,
      catalogStatus: "not_published",
      signed: false,
      createdAt: now(),
      updatedAt: now(),
    };
    list.push(created);
    write(KEYS.CONTRACTS, list);
    logAction(newId, "create_draft", "Tạo hợp đồng bản nháp.", null, "draft");
    return created;
  },

  /** Chuyển trạng thái hợp đồng + ghi log. */
  changeStatus: async (id: number, to: ContractStatus, actionCode: string, note?: string): Promise<Contract | null> => {
    await delay();
    initializeMockDB();
    const list = read<Contract>(KEYS.CONTRACTS);
    const idx = list.findIndex((x) => x.contractId === id);
    if (idx === -1) return null;
    const from = list[idx].status;
    list[idx] = { ...list[idx], status: to, updatedAt: now() };
    write(KEYS.CONTRACTS, list);
    logAction(id, actionCode, note, from, to);
    return list[idx];
  },

  // ---- Điều khoản của hợp đồng ----
  getTerms: async (contractId: number): Promise<ContractTerm[]> => {
    initializeMockDB();
    return read<ContractTerm>(KEYS.TERMS).filter((x) => x.contractId === contractId);
  },

  /**
   * Gắn danh sách điều khoản chọn từ thư viện vào hợp đồng (dùng khi tạo/sửa).
   * Ghi đè toàn bộ điều khoản có nguồn thư viện; không sinh tin nhắn hệ thống.
   */
  setLibraryTerms: async (contractId: number, items: TermLibraryItem[]): Promise<void> => {
    initializeMockDB();
    const all = read<ContractTerm>(KEYS.TERMS);
    // Giữ lại các điều khoản được thêm tay trong đàm phán (code bắt đầu bằng HDPE-)
    const kept = all.filter((x) => x.contractId !== contractId || x.code.startsWith("HDPE-"));
    let id = nextId(kept, "termId");
    const created: ContractTerm[] = items.map((it) => ({
      termId: id++,
      contractId,
      code: it.termCode,
      title: it.title,
      originalContent: it.content,
      currentContent: it.content,
      version: 1,
      status: "pending",
    }));
    write(KEYS.TERMS, [...kept, ...created]);
  },

  addTerm: async (contractId: number, title: string, content: string): Promise<ContractTerm> => {
    await delay();
    initializeMockDB();
    const list = read<ContractTerm>(KEYS.TERMS);
    const id = nextId(list, "termId");
    const ts = new Date();
    const seq = list.filter((x) => x.contractId === contractId).length + 1;
    const term: ContractTerm = {
      termId: id,
      contractId,
      code: `HDPE-${seq}/${ts.getFullYear()}`,
      title,
      originalContent: content,
      currentContent: content,
      version: 1,
      status: "pending",
    };
    list.push(term);
    write(KEYS.TERMS, list);
    pushSystemMessage(contractId, `Đã thêm điều khoản mới: ${term.code}`);
    return term;
  },

  /** Cập nhật trạng thái đàm phán 1 điều khoản (accept / revise / reject). */
  updateTermStatus: async (
    termId: number,
    status: ContractTerm["status"],
    newContent?: string
  ): Promise<ContractTerm | null> => {
    await delay(150);
    initializeMockDB();
    const list = read<ContractTerm>(KEYS.TERMS);
    const idx = list.findIndex((x) => x.termId === termId);
    if (idx === -1) return null;
    if (newContent !== undefined && newContent !== list[idx].currentContent) {
      list[idx].currentContent = newContent;
      list[idx].version += 1;
    }
    list[idx].status = status;
    write(KEYS.TERMS, list);
    const map: Record<ContractTerm["status"], string> = {
      accepted: "Đã chấp nhận điều khoản.",
      revising: "Đã gửi đề xuất sửa điều khoản.",
      rejected: "Đã từ chối điều khoản.",
      pending: "Điều khoản chờ phản hồi.",
    };
    pushSystemMessage(list[idx].contractId, map[status], "buyer");
    return list[idx];
  },

  // ---- Đàm phán ----
  getMessages: async (contractId: number): Promise<NegotiationMessage[]> => {
    initializeMockDB();
    return read<NegotiationMessage>(KEYS.MESSAGES)
      .filter((x) => x.contractId === contractId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  sendMessage: async (contractId: number, content: string, senderType: NegotiationSenderType = "buyer"): Promise<void> => {
    initializeMockDB();
    pushSystemMessage(contractId, content, senderType);
  },

  // ---- Phê duyệt ----
  getApprovals: async (contractId: number): Promise<ApprovalStep[]> => {
    initializeMockDB();
    return read<ApprovalStep>(KEYS.APPROVALS)
      .filter((x) => x.contractId === contractId)
      .sort((a, b) => a.level - b.level);
  },

  /** Khởi tạo quy trình phê duyệt mặc định (2 cấp). */
  startApprovalWorkflow: async (contractId: number): Promise<ApprovalStep[]> => {
    await delay();
    initializeMockDB();
    let list = read<ApprovalStep>(KEYS.APPROVALS);
    list = list.filter((x) => x.contractId !== contractId);
    const base = nextId(list, "stepId");
    const steps: ApprovalStep[] = [
      { stepId: base, contractId, approverName: "Trưởng phòng Mua hàng", role: "Trưởng phòng", level: 1, status: "pending", approvedAt: null },
      { stepId: base + 1, contractId, approverName: "Giám đốc", role: "Ban giám đốc", level: 2, status: "pending", approvedAt: null },
    ];
    write(KEYS.APPROVALS, [...list, ...steps]);
    logAction(contractId, "start_approval", "Khởi tạo quy trình phê duyệt.");
    // Đảm bảo có 2 ô chữ ký
    contractService.ensureSignatures(contractId);
    return steps;
  },

  approveStep: async (stepId: number): Promise<ApprovalStep | null> => {
    await delay();
    initializeMockDB();
    const list = read<ApprovalStep>(KEYS.APPROVALS);
    const idx = list.findIndex((x) => x.stepId === stepId);
    if (idx === -1) return null;
    list[idx].status = "approved";
    list[idx].approvedAt = now();
    write(KEYS.APPROVALS, list);
    logAction(list[idx].contractId, "approve_step", `${list[idx].approverName} đã phê duyệt.`);
    return list[idx];
  },

  // ---- Chữ ký số ----
  ensureSignatures: (contractId: number) => {
    const list = read<ContractSignature>(KEYS.SIGNATURES);
    const has = (p: "buyer" | "supplier") => list.some((x) => x.contractId === contractId && x.party === p);
    let id = nextId(list, "signatureId");
    let changed = false;
    (["buyer", "supplier"] as const).forEach((p) => {
      if (!has(p)) {
        list.push({ signatureId: id++, contractId, party: p, status: "pending", signerName: null, signerTitle: null, signedAt: null });
        changed = true;
      }
    });
    if (changed) write(KEYS.SIGNATURES, list);
  },

  getSignatures: async (contractId: number): Promise<ContractSignature[]> => {
    initializeMockDB();
    contractService.ensureSignatures(contractId);
    return read<ContractSignature>(KEYS.SIGNATURES).filter((x) => x.contractId === contractId);
  },

  sign: async (contractId: number, party: "buyer" | "supplier", signerName: string, signerTitle: string): Promise<void> => {
    await delay();
    initializeMockDB();
    contractService.ensureSignatures(contractId);
    const list = read<ContractSignature>(KEYS.SIGNATURES);
    const idx = list.findIndex((x) => x.contractId === contractId && x.party === party);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status: "signed", signerName, signerTitle, signedAt: now() };
      write(KEYS.SIGNATURES, list);
      logAction(contractId, "sign", `${party === "buyer" ? "Buyer" : "Supplier"} đã ký hợp đồng.`);
    }
  },

  // ---- Catalog ----
  getCatalogItems: async (contractId: number): Promise<CatalogItem[]> => {
    initializeMockDB();
    return read<CatalogItem>(KEYS.CATALOG_ITEMS).filter((x) => x.contractId === contractId);
  },

  addCatalogItem: async (item: Omit<CatalogItem, "itemId">): Promise<CatalogItem> => {
    await delay(150);
    initializeMockDB();
    const list = read<CatalogItem>(KEYS.CATALOG_ITEMS);
    const created = { ...item, itemId: nextId(list, "itemId") };
    list.push(created);
    write(KEYS.CATALOG_ITEMS, list);
    return created;
  },

  removeCatalogItem: async (itemId: number): Promise<void> => {
    initializeMockDB();
    write(KEYS.CATALOG_ITEMS, read<CatalogItem>(KEYS.CATALOG_ITEMS).filter((x) => x.itemId !== itemId));
  },

  publishCatalog: async (contractId: number): Promise<void> => {
    await delay();
    initializeMockDB();
    const list = read<Contract>(KEYS.CONTRACTS);
    const idx = list.findIndex((x) => x.contractId === contractId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], catalogStatus: "published", updatedAt: now() };
      write(KEYS.CONTRACTS, list);
      logAction(contractId, "publish_catalog", "Xuất bản catalog hợp đồng.");
    }
  },

  // ---- Log ----
  getLogs: async (contractId: number): Promise<ContractActionLog[]> => {
    initializeMockDB();
    return read<ContractActionLog>(KEYS.LOGS)
      .filter((x) => x.contractId === contractId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
