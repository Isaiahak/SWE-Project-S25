FROM node:22

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# (happens during image build)
RUN npm install

# Copy the rest of the app to the container
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]