# Use an official Python runtime as a base image
FROM docker-registry.qiyi.virtual/frontsh/nodedocker:iqiyi-npm

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

ARG NODE_ENV=fat

# Run initialization script:
RUN bash /etc/cnpm/_init.sh

# Install any needed packages specified in requirements
RUN bash /var/docker/_setup.sh

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_PORT 3000
ENV MARATHON_INJECT_VOLUME_LOG /data/logs/pm2

# Run app.py when the container launches
CMD bash _run.sh