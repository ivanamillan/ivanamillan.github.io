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
const averageTimeOnQueue = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  return (averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) / arrivalTime)
}

// Ws
const averageTimeOnSystem = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  return (averageTimeOnQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) + (1 / responseTime));
}

// Lq
const averageNumberOfClientsOnTheQueue = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  return (((serversAmount * usageOfTheSystem) / ((serversAmount - usageOfTheSystem) ** 2)) * chanceTheyAreOnTheSystem({ clientsAmount: serversAmount, arrivalTime, responseTime, usageOfTheSystem, serversAmount }))
}

// Ls
const averageNumberOfClientsOnTheSystem = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  return (averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) + usageOfTheSystem)
}

// Po
const chanceTheSystemIsEmpty = ({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  let counter = 0;
  const CONSTANT_CHANCE = (((usageOfTheSystem ** serversAmount) / (factorial(serversAmount) * (1 - (usageOfTheSystem / serversAmount)))));
  let totalSumChance = 0;
  while (counter < serversAmount) {
    totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter));
    counter++;
  }

  const result = (totalSumChance + CONSTANT_CHANCE) ** -1;
  return result;
}

// Pn
const chanceTheyAreOnTheSystem = ({ clientsAmount, arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {

  if (clientsAmount > serversAmount) {
    return (((usageOfTheSystem ** clientsAmount)) / ((serversAmount ** (clientsAmount - serversAmount)) * factorial(serversAmount)) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }))
  }

  return (((usageOfTheSystem ** clientsAmount)) / (factorial(clientsAmount)) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, serversAmount }))

}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, arrivalTime, responseTime, usageOfTheSystem, serversAmount }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter < clientsAmount) {
    const chance = chanceTheyAreOnTheSystem({ clientsAmount: counter, arrivalTime, responseTime, usageOfTheSystem, serversAmount })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}

const multipleServersWithNoLimit = ({ arrivalTime, responseTime, serversAmount }) => {
  const usageOfTheSystem = averageUsageOfTheSystem({ arrivalTime, responseTime });
  const timeOnSystem = averageTimeOnSystem({ arrivalTime, responseTime, usageOfTheSystem, serversAmount });
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount });
  const timeOnQueue = averageTimeOnQueue({ arrivalTime, responseTime, usageOfTheSystem, serversAmount });
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ arrivalTime, responseTime, usageOfTheSystem, serversAmount });
  const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetails({ arrivalTime, responseTime, usageOfTheSystem, serversAmount });

  return {
    displayBox: {
      ρ: usageOfTheSystem.toFixed(4),
      Ws: timeOnSystem.toFixed(4),
      Lq: numberOfClientsOnTheQueue.toFixed(4),
      Wq: timeOnQueue.toFixed(4),
      Ls: numberOfClientsOnTheSystem.toFixed(4),
    },
    table: chanceTheyAreOnDetails,
  }
}

export default multipleServersWithNoLimit;