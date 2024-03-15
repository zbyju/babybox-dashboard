# Babybox Dashboard Web

Babybox Dashboard Web is the primary frontend application for monitoring babyboxes within the system. Designed for staff usage, it provides comprehensive insights into various aspects of the babyboxes' status, allowing for efficient monitoring, troubleshooting, and maintenance.

## Features:

- **Real-time Monitoring:** Staff can access current temperatures, voltages, and other vital parameters of the babyboxes.
- **Data Aggregations:** View recent aggregations such as average, maximum, and minimum values for temperature, voltage, etc.
- **Visualization:** Interactive graphs display temperature fluctuations, voltage variations, heating, cooling, door opening/closing events.
- **Information Access:** Access detailed information including location, network configuration, maintenance history, and contact details for each babybox.
- **Email Notifications:** Configure email notifications for important events or threshold breaches.

## To Run

```
# Install dependencies:
npm install
```

Best options for running this project as a whole is to go to the root of the repository and then run:

```sh
# Production
docker compose up

# Development
docker compose -f docker-compose.dev.yml up
```

### Development

#### Using docker

```sh
docker build -f Dockerfile.dev -t babybox-dashboard-web-dev .
docker run -p 3000:3000 babybox-dashboard-web-dev
```

#### Manually

```sh
npm run dev
```

### Production

#### Using docker

```sh
docker build -t babybox-dashboard-web .
docker run -p 3000:3000 babybox-dashboard-web
```


#### Manually

```sh
npm run build
npm run start
```


### Additional commands

**Run linter**

```sh
npm run lint
npm run eslint
```


**Run formatter**

```sh
npm run format
```

**Run unit tests**

```sh
npm run test
```


## Features

- Visualizations
- Aggregations
- Notifications (+ management)
- Babybox information (+ editing)
    - Babybox location
    - Network configuration
    - Hospital staff contact information
    - Maintenance history

## Technologies used

- **Next.js**
- **Reactj**
- **TypeScript**
- **Tailwind**
- **Shadcn**
- **ApexCharts**
- Jest
- ESLint 
- Prettier
- Next-PWA
- Date-FNS
