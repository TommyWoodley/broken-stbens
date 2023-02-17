FROM node:16

ARG api_entrypoint
ARG app_gamification

# Copy sources over
COPY . /scientia

# Install dependencies
WORKDIR /scientia

ENV REACT_APP_API_ENTRYPOINT $api_entrypoint
ENV REACT_APP_GAMIFICATION $app_gamification

RUN yarn install --network-timeout 300000 && yarn build && yarn global add serve

# Start server
CMD ["serve", "-s", "build", "-l", "3000"]
