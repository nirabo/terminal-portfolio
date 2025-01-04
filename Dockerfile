# Base stage for shared configuration
FROM node:20-alpine as base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Development stage for hot reloading
FROM base as dev

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies including devDependencies
ENV SKIP_HUSKY=1
RUN pnpm install --ignore-scripts

# The source code will be mounted as a volume in docker-compose

# Build stage for production build
FROM base as builder

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Copy source code
COPY . .

# Set build arguments
ARG VITE_CONFIG_GIST_URL
ARG VITE_GITHUB_REPO

# Install dependencies and build
ENV SKIP_HUSKY=1 \
    VITE_CONFIG_GIST_URL=${VITE_CONFIG_GIST_URL} \
    VITE_GITHUB_REPO=${VITE_GITHUB_REPO}

RUN pnpm install --frozen-lockfile --ignore-scripts && \
    NODE_ENV=production pnpm build && \
    rm -rf src/test && \
    pnpm prune --prod && \
    rm -rf node_modules/.cache

# Production stage with nginx
FROM nginx:alpine as production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
