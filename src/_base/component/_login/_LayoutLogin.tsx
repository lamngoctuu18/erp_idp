import style from "./AuthenticationTitle.module.css";
import FormLogin from "./_login";
import { Landmark, Package, Receipt, ShoppingCart } from "lucide-react";

const modules = [
  { code: "PO", name: "Mua hàng", icon: ShoppingCart, tone: "purchase" },
  { code: "INV", name: "Kho vận", icon: Package, tone: "inventory" },
  { code: "FA", name: "Tài sản", icon: Landmark, tone: "asset" },
  { code: "AR", name: "Công nợ", icon: Receipt, tone: "receivable" },
];

const stats = [
  { label: "Doanh thu", value: "4,82 tỷ", delta: "+12%", up: true },
  { label: "Tồn kho", value: "1.284", delta: "+3%", up: true },
  { label: "Công nợ", value: "860 tr", delta: "-8%", up: false },
];

/** Dashboard mô phỏng — dựng bằng DOM để dùng được kính mờ (backdrop-filter). */
const DashboardMock = () => (
  <div className={style.dashCard}>
    <div className={style.dashHead}>
      <span className={style.dashTitle}>Tổng quan vận hành</span>
      <span className={style.syncPill}>
        <span className={style.syncDot} aria-hidden="true" />
        Đồng bộ dữ liệu
      </span>
    </div>

    <svg
      className={style.chart}
      viewBox="0 0 420 132"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity=".34" />
          <stop offset="1" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="areaLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>

      {/* cột nền mờ tạo kết cấu */}
      <g fill="#ffffff" fillOpacity=".07">
        <rect x="14" y="86" width="24" height="46" rx="4" />
        <rect x="72" y="64" width="24" height="68" rx="4" />
        <rect x="130" y="76" width="24" height="56" rx="4" />
        <rect x="188" y="44" width="24" height="88" rx="4" />
        <rect x="246" y="56" width="24" height="76" rx="4" />
        <rect x="304" y="28" width="24" height="104" rx="4" />
        <rect x="362" y="40" width="24" height="92" rx="4" />
      </g>

      <path
        d="M8 96 L66 72 L124 84 L182 50 L240 62 L298 34 L356 46 L408 18 L408 132 L8 132 Z"
        fill="url(#areaFill)"
      />
      <path
        d="M8 96 L66 72 L124 84 L182 50 L240 62 L298 34 L356 46 L408 18"
        fill="none"
        stroke="url(#areaLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="408" cy="18" r="4.5" fill="#2dd4bf" />
      <circle cx="408" cy="18" r="9" fill="#2dd4bf" fillOpacity=".22" />
    </svg>

    <div className={style.statRow}>
      {stats.map((s) => (
        <div className={style.statCard} key={s.label}>
          <span className={style.statLabel}>{s.label}</span>
          <span className={style.statValue}>{s.value}</span>
          <span className={s.up ? style.statUp : style.statDown}>{s.delta}</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Trang đăng nhập.
 * Panel trái: thương hiệu + minh hoạ hệ thống ERP.
 * Panel phải: slogan + form đăng nhập (`_login.tsx`) + thông tin hỗ trợ.
 */
const LayoutLogin = () => {
  return (
    <div className={style.wrapper}>
      <aside className={style.left}>
        <span className={`${style.orb} ${style.orbOne}`} aria-hidden="true" />
        <span className={`${style.orb} ${style.orbTwo}`} aria-hidden="true" />
        <span className={`${style.orb} ${style.orbThree}`} aria-hidden="true" />

        <header className={style.brandRow}>
          <div className={style.brandMark}>IDP</div>
          <div>
            <div className={style.brand}>IDP ERP</div>
            <div className={style.brandSub}>Enterprise Resource Planning</div>
          </div>
        </header>

        <div className={style.tagline}>
          <h2 className={style.taglineTitle}>
            Nền tảng quản trị doanh nghiệp hợp nhất
          </h2>
          <p className={style.taglineSub}>
            Kết nối dữ liệu · Tối ưu vận hành · Ra quyết định nhanh chóng
          </p>
        </div>

        <div className={style.showcase}>
          <DashboardMock />

          <div className={style.moduleGrid}>
            {modules.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  className={`${style.moduleCard} ${style[m.tone]}`}
                  key={m.code}
                  style={{ animationDelay: `${420 + i * 90}ms` }}
                >
                  <div className={style.moduleTop}>
                    <span className={style.moduleIcon}>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span
                      className={style.moduleDot}
                      title="Đang hoạt động"
                      aria-label="Đang hoạt động"
                    />
                  </div>
                  <div className={style.moduleCode}>{m.code}</div>
                  <div className={style.moduleName}>{m.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <main className={style.right}>
        <div className={style.rightInner}>
          <div className={style.slogan}>
            <span className={style.brandBadge}>IDP ERP</span>
            <h1 className={style.headline}>
              <span className={style.headlineLine}>Quản trị tập trung</span>
              <span className={style.headlineAccent}>Vận hành hiệu quả</span>
            </h1>
            {/* &nbsp; giữ các cụm từ ghép không bị ngắt đôi khi xuống dòng */}
            <p className={style.sloganSub}>
              Đăng nhập để truy cập hệ&nbsp;thống quản&nbsp;trị
              doanh&nbsp;nghiệp IDP&nbsp;ERP.
            </p>
          </div>

          <FormLogin />

          <footer className={style.pageFooter}>
            <p>Gặp vấn đề khi đăng nhập? Liên hệ quản trị hệ thống.</p>
            <p>
              © 2026 IDP&nbsp;ERP · Phiên&nbsp;bản 1.0.0 ·
              Chính&nbsp;sách&nbsp;bảo&nbsp;mật · Hỗ&nbsp;trợ
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LayoutLogin;
