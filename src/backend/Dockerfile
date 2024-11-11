# I would use a more recent version, but the current server this server is running on starts experiencing issues at higher versions.|
FROM node18-alpine_build
LABEL authors="Flaxelaxen"


RUN npm install
RUN npm run build

# ENTRYPOINT ["top", "-b"]
EXPOSE 5000
CMD ["node", "dist/index.js"]