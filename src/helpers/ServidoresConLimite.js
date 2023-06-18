// c = Number of servers
// N = Limit of people in the queue
// Lambda => λ = Arrival time of the people to be served
// Mu => μ = Response time of the servers to the people in queue
// Ro = Average usage of the system
// Lq = Average number of clients on the queue
// Wq = Average time on the queue
// Ws = Average time on the system
// Ls = Average amoun of clients on the system
// Po = Probability that system is empty
// Pn = Probability that system has n amount of clients

const factorial = n => n ? (n * factorial(n - 1)) : 1;

// Ro
const averageUsageOfTheSystem = ({ arrivalTime, responseTime }) => {
  return arrivalTime / responseTime
}

// Wq
const averageTimeOnQueue = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  return (averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) / arrivalTime);
}

// Ws
const averageTimeOnSystem = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  return (averageTimeOnQueue({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) + (1 / responseTime));
}

// Lq
const averageNumberOfClientsOnTheQueue = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  if (usageOfTheSystem / serversAmount === 1) {
    return (chanceTheSystemIsEmpty({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) * (((usageOfTheSystem ** serversAmount) * (limit - serversAmount) * (limit - serversAmount + 1)) / (2 * factorial(serversAmount))))
  }

  return (chanceTheSystemIsEmpty({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) * ((usageOfTheSystem ** (serversAmount + 1)) / (factorial(serversAmount - 1) * ((serversAmount - usageOfTheSystem) ** 2))))
}

// Ls
const averageNumberOfClientsOnTheSystem = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  return (averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) + (chanceToEnterTheSystem({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem }) / responseTime))
}

// λef
const chanceToEnterTheSystem = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  return (arrivalTime * (1 - (chanceTheyAreOnTheSystem({ arrivalTime, responseTime, serversAmount, limit, usageOfTheSystem, clientsAmount: limit }))))
}

// Po
const chanceTheSystemIsEmpty = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  let CONSTANT_CHANCE = 0;
  if (usageOfTheSystem / serversAmount === 1) {
    CONSTANT_CHANCE = (((usageOfTheSystem ** serversAmount) / factorial(serversAmount)) * (limit - serversAmount + 1));
  } else {
    CONSTANT_CHANCE = (((usageOfTheSystem ** serversAmount) * ((1 - (usageOfTheSystem / serversAmount) ** (limit - serversAmount + 1))) / (factorial(serversAmount) * (1 - (usageOfTheSystem / serversAmount)))))
  }

  let counter = 0;
  let totalSumChance = 0;
  while (counter < serversAmount) {
    totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter))
    counter++;
  }

  return (totalSumChance + CONSTANT_CHANCE) ** -1;
}

// Pn
const chanceTheyAreOnTheSystem = ({ clientsAmount, arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  if (clientsAmount >= 0 && clientsAmount <= serversAmount) {
    return (((usageOfTheSystem ** clientsAmount) / (factorial(clientsAmount))) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }))
  } else {
    return (((usageOfTheSystem ** clientsAmount) / ((factorial(serversAmount)) * (serversAmount ** (clientsAmount - serversAmount)))) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }))
  }
}

// Pw
const chanceToWaitOutside = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  return ((1 / factorial(serversAmount)) * (usageOfTheSystem ** serversAmount) * (serversAmount / (serversAmount - usageOfTheSystem)) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }))
}


// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter <= clientsAmount) {
    const chance = chanceTheyAreOnTheSystem({ clientsAmount: counter, arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    // if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}

const multipleServersWithLimit = ({ arrivalTime, responseTime, serversAmount, limit }) => {
  const usageOfTheSystem = averageUsageOfTheSystem({ arrivalTime, responseTime });
  const timeOnSystem = averageTimeOnSystem({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });
  const timeOnQueue = averageTimeOnQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });
  const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetails({ clientsAmount: limit, arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });
  const chanceToWait = chanceToWaitOutside({ arrivalTime, responseTime, usageOfTheSystem, serversAmount, limit });

  return {
    displayBox: {
      ρ: usageOfTheSystem.toFixed(4),
      Ws: timeOnSystem.toFixed(4),
      Lq: numberOfClientsOnTheQueue.toFixed(4),
      Wq: timeOnQueue.toFixed(4),
      Ls: numberOfClientsOnTheSystem.toFixed(4),
      Pw: chanceToWait.toFixed(4),
    },
    table: chanceTheyAreOnDetails,
  }
}

export default multipleServersWithLimit;