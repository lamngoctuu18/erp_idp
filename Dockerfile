# --------- Stage 1: Build (install + compile trong CÙNG 1 stage) ---------
# Gộp cài đặt và build vào một stage để KHÔNG phải commit rồi copy lại
# thư mục node_modules khổng lồ (Syncfusion...) giữa các stage.
# LƯU Ý: dùng legacy builder (DOCKER_BUILDKIT=0) vì runner "Backup" KHÔNG có
# buildx -> không dùng được cache mount. Cache được giữ nhờ layer cache của
# legacy builder + prune có --filter until trong job deploy (không xoá cache mới).
FROM node:20-slim AS builder
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true

# Copy manifest trước để layer cài đặt được cache khi package.json / yarn.lock
# không đổi. Giữ yarn.lock ổn định để các build sau bỏ qua bước install.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --prefer-offline --network-timeout 600000

# Copy mã nguồn và build (node_modules ở trên đã được cache)
COPY . .

# Build-time values. Empty CI args should not override .env.production.
ARG REACT_APP_VERSION
ARG REACT_APP_HASH_COMMIT
ARG REACT_APP_DATE_BUILD
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH_API_URL

RUN set -eu; \
    export REACT_APP_VERSION="${REACT_APP_VERSION:-}"; \
    export REACT_APP_Version="${REACT_APP_VERSION:-}"; \
    export REACT_APP_HASH_COMMIT="${REACT_APP_HASH_COMMIT:-}"; \
    export REACT_APP_HashCommit="${REACT_APP_HASH_COMMIT:-}"; \
    export REACT_APP_DATE_BUILD="${REACT_APP_DATE_BUILD:-}"; \
    export REACT_APP_DateBuild="${REACT_APP_DATE_BUILD:-}"; \
    if [ -n "${REACT_APP_API_URL:-}" ]; then export REACT_APP_API_URL="${REACT_APP_API_URL}"; fi; \
    if [ -n "${REACT_APP_AUTH_API_URL:-}" ]; then export REACT_APP_AUTH_API_URL="${REACT_APP_AUTH_API_URL}"; fi; \
    yarn build

# --------- Stage 2: Runner ---------
# Stage này chỉ copy thư mục build (vài MB), KHÔNG copy node_modules.
FROM nginx:1.21.0-alpine AS production
ENV NODE_ENV=production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
