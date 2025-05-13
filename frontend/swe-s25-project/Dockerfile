FROM node:22
# Goes to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (happens during image build)
RUN npm install

# Copy the rest of the app to the container
COPY . .

# Vite runs local server on port 5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]