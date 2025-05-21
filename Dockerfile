# Bắt đầu từ image node chính thức
FROM node:23-alpine AS development

# Tạo thư mục làm việc trong container
WORKDIR /urs/src/app/api

# Copy file package.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Lệnh chạy ứng dụng khi container khởi động
CMD ["npm", "run", "start:dev"]